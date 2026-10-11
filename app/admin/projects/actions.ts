'use server'

import { revalidatePath } from 'next/cache'
import { del, put } from '@vercel/blob'
import { desc, eq } from 'drizzle-orm'
import { z } from 'zod'
import { requireAdminSession } from '@/lib/auth-guard'
import { getDb } from '@/lib/db/client'
import { activityLog, projects } from '@/lib/db/schema'
import { slugify } from '@/lib/utils'

const projectSchema = z.object({
  title: z.string().trim().min(1).max(120),
  description: z.string().trim().min(1).max(500),
  tags: z.string().transform((value) =>
    value
      .split(',')
      .map((tag) => tag.trim())
      .filter(Boolean),
  ),
  repoUrl: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  deployUrl: z
    .string()
    .trim()
    .url()
    .optional()
    .or(z.literal('').transform(() => undefined)),
  status: z.enum(['in_progress', 'completed', 'archived']),
  published: z.coerce.boolean(),
  featured: z.coerce.boolean(),
})

const MAX_COVER_BYTES = 4 * 1024 * 1024
const ALLOWED_COVER_TYPES = ['image/png', 'image/jpeg', 'image/webp']

async function uploadCoverIfPresent(formData: FormData) {
  const file = formData.get('cover')
  if (!(file instanceof File) || file.size === 0) return undefined

  if (!ALLOWED_COVER_TYPES.includes(file.type)) {
    throw new Error('Formato de imagem inválido (use PNG, JPEG ou WebP).')
  }
  if (file.size > MAX_COVER_BYTES) {
    throw new Error('Imagem muito grande (máximo 4MB).')
  }

  const blob = await put(`projects/${crypto.randomUUID()}-${file.name}`, file, {
    access: 'public',
    addRandomSuffix: false,
  })
  return blob.url
}

async function uniqueSlug(title: string, ignoreId?: string) {
  const base = slugify(title) || 'projeto'
  const db = getDb()
  let slug = base
  let suffix = 1
  while (true) {
    const existing = await db
      .select({ id: projects.id })
      .from(projects)
      .where(eq(projects.slug, slug))
    const conflict = existing.find((row) => row.id !== ignoreId)
    if (!conflict) return slug
    suffix += 1
    slug = `${base}-${suffix}`
  }
}

export async function createProject(formData: FormData) {
  await requireAdminSession()

  const parsed = projectSchema.parse({
    title: formData.get('title'),
    description: formData.get('description'),
    tags: formData.get('tags') ?? '',
    repoUrl: formData.get('repoUrl'),
    deployUrl: formData.get('deployUrl'),
    status: formData.get('status'),
    published: formData.get('published') === 'on',
    featured: formData.get('featured') === 'on',
  })

  const coverUrl = await uploadCoverIfPresent(formData)
  const slug = await uniqueSlug(parsed.title)
  const db = getDb()

  const [{ maxPosition } = { maxPosition: null }] = await db
    .select({
      maxPosition: projects.position,
    })
    .from(projects)
    .orderBy(desc(projects.position))
    .limit(1)

  const [created] = await db
    .insert(projects)
    .values({
      ...parsed,
      slug,
      coverUrl,
      position: (maxPosition ?? -1) + 1,
    })
    .returning()

  await db.insert(activityLog).values({
    action: 'create',
    entity: 'project',
    entityId: created.id,
  })

  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function updateProject(id: string, formData: FormData) {
  await requireAdminSession()

  const parsed = projectSchema.parse({
    title: formData.get('title'),
    description: formData.get('description'),
    tags: formData.get('tags') ?? '',
    repoUrl: formData.get('repoUrl'),
    deployUrl: formData.get('deployUrl'),
    status: formData.get('status'),
    published: formData.get('published') === 'on',
    featured: formData.get('featured') === 'on',
  })

  const coverUrl = await uploadCoverIfPresent(formData)
  const db = getDb()
  const current = await db.select().from(projects).where(eq(projects.id, id))
  if (!current[0]) throw new Error('Projeto não encontrado.')

  const slug =
    current[0].title === parsed.title
      ? current[0].slug
      : await uniqueSlug(parsed.title, id)

  await db
    .update(projects)
    .set({
      ...parsed,
      slug,
      ...(coverUrl ? { coverUrl } : {}),
      updatedAt: new Date(),
    })
    .where(eq(projects.id, id))

  await db.insert(activityLog).values({
    action: 'update',
    entity: 'project',
    entityId: id,
  })

  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function deleteProject(id: string) {
  await requireAdminSession()

  const db = getDb()
  const [existing] = await db.select().from(projects).where(eq(projects.id, id))
  if (!existing) return

  await db.delete(projects).where(eq(projects.id, id))

  if (existing.coverUrl) {
    await del(existing.coverUrl).catch(() => {})
  }

  await db.insert(activityLog).values({
    action: 'delete',
    entity: 'project',
    entityId: id,
  })

  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function toggleProjectPublished(id: string, published: boolean) {
  await requireAdminSession()

  const db = getDb()
  await db
    .update(projects)
    .set({ published, updatedAt: new Date() })
    .where(eq(projects.id, id))

  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function toggleProjectFeatured(id: string, featured: boolean) {
  await requireAdminSession()

  const db = getDb()
  await db
    .update(projects)
    .set({ featured, updatedAt: new Date() })
    .where(eq(projects.id, id))

  revalidatePath('/admin/projects')
  revalidatePath('/')
}

export async function reorderProjects(orderedIds: string[]) {
  await requireAdminSession()

  const db = getDb()
  await Promise.all(
    orderedIds.map((id, index) =>
      db.update(projects).set({ position: index }).where(eq(projects.id, id)),
    ),
  )

  revalidatePath('/admin/projects')
  revalidatePath('/')
}
