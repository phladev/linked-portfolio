'use server'

import { revalidatePath } from 'next/cache'
import { eq, inArray, sql } from 'drizzle-orm'
import { z } from 'zod'
import { requireAdminSession } from '@/lib/auth-guard'
import { getDb } from '@/lib/db/client'
import {
  demos,
  leadInteractions,
  leads,
  messageTemplates,
  siteContent,
} from '@/lib/db/schema'
import { addDaysISO, todayISO } from '@/lib/leads/dates'
import { FOLLOW_UP_DAYS } from '@/lib/leads/constants'
import { normalizePhone } from '@/lib/leads/whatsapp'

const STAGE = z.enum([
  'novo',
  'contatado',
  'demo_enviada',
  'respondeu',
  'reuniao',
  'proposta',
  'fechado',
  'perdido',
])
const NICHE = z.enum([
  'advocacia',
  'clinica',
  'imobiliaria',
  'restaurante',
  'academia',
  'barbearia',
  'outro',
])
const SOURCE = z.enum([
  'google',
  'maps',
  'instagram',
  'anuncios',
  'indicacao',
  'outro',
])
const QUALITY = z.enum(['desconhecido', 'nenhum', 'fraco', 'bom'])
const INTERACTION = z.enum([
  'whatsapp',
  'ligacao',
  'email',
  'instagram',
  'reuniao',
  'nota',
])

const opt = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .transform((v) => (v === '' ? null : v))
    .nullish()

const isoDate = z.string().regex(/^\d{4}-\d{2}-\d{2}$/)

const leadFields = {
  name: z.string().trim().min(2, 'Informe o nome do negócio.').max(160),
  niche: NICHE,
  city: opt(80),
  contactName: opt(120),
  phone: opt(40),
  instagram: opt(200),
  website: opt(300),
  email: opt(200),
  source: SOURCE,
  siteQuality: QUALITY,
  runsAds: z.boolean(),
  demoSlug: opt(80),
  nextActionAt: isoDate.nullish(),
  nextActionNote: opt(200),
  valueEstimate: z.number().int().min(0).max(10_000_000).nullish(),
  notes: opt(4000),
}

const createSchema = z.object(leadFields).partial({
  city: true,
  contactName: true,
  phone: true,
  instagram: true,
  website: true,
  email: true,
  demoSlug: true,
  nextActionAt: true,
  nextActionNote: true,
  valueEstimate: true,
  notes: true,
  source: true,
  siteQuality: true,
  runsAds: true,
})

const updateSchema = z.object(leadFields).partial()

function refresh(leadId?: string) {
  revalidatePath('/admin')
  revalidatePath('/admin/leads')
  revalidatePath('/admin/funil')
  revalidatePath('/admin/metricas')
  revalidatePath('/admin/demos')
  if (leadId) revalidatePath(`/admin/leads/${leadId}`)
}

export async function createLead(input: z.input<typeof createSchema>) {
  await requireAdminSession()
  const data = createSchema.parse(input)
  const [created] = await getDb()
    .insert(leads)
    .values({
      ...data,
      source: data.source ?? 'outro',
      siteQuality: data.siteQuality ?? 'desconhecido',
      runsAds: data.runsAds ?? false,
    })
    .returning({ id: leads.id })
  refresh()
  return { id: created.id }
}

export async function updateLead(
  id: string,
  input: z.input<typeof updateSchema>,
) {
  await requireAdminSession()
  const data = updateSchema.parse(input)
  await getDb()
    .update(leads)
    .set({ ...data, updatedAt: new Date() })
    .where(eq(leads.id, id))
  refresh(id)
}

export async function moveLead(
  id: string,
  stage: z.infer<typeof STAGE>,
  lostReason?: string,
) {
  await requireAdminSession()
  const next = STAGE.parse(stage)
  const db = getDb()
  const [current] = await db.select().from(leads).where(eq(leads.id, id))
  if (!current) throw new Error('Lead não encontrado.')
  if (current.stage === next) return

  const closing = next === 'fechado' || next === 'perdido'
  const reason = next === 'perdido' ? lostReason?.trim() || null : null

  await db.batch([
    db
      .update(leads)
      .set({
        stage: next,
        stageChangedAt: new Date(),
        updatedAt: new Date(),
        lostReason: reason,
        ...(closing ? { nextActionAt: null, nextActionNote: null } : {}),
      })
      .where(eq(leads.id, id)),
    db.insert(leadInteractions).values({
      leadId: id,
      type: 'etapa',
      content: `${current.stage} → ${next}${reason ? ` (${reason})` : ''}`,
    }),
  ])
  refresh(id)
}

export async function addInteraction(
  leadId: string,
  type: z.infer<typeof INTERACTION>,
  content: string,
) {
  await requireAdminSession()
  const kind = INTERACTION.parse(type)
  const text = z.string().trim().max(2000).parse(content)
  const db = getDb()
  const contact = kind !== 'nota'

  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId))
  if (!lead) throw new Error('Lead não encontrado.')

  // Fazer o contato conclui a ação que estava marcada para hoje (ou atrasada).
  const today = todayISO()
  const cleared = contact && !!lead.nextActionAt && lead.nextActionAt <= today

  await db.batch([
    db.insert(leadInteractions).values({ leadId, type: kind, content: text }),
    db
      .update(leads)
      .set({
        updatedAt: new Date(),
        ...(contact ? { lastContactAt: new Date() } : {}),
        ...(cleared ? { nextActionAt: null, nextActionNote: null } : {}),
      })
      .where(eq(leads.id, leadId)),
  ])
  refresh(leadId)
  return { cleared }
}

/** Registra o envio da demo: histórico, etapa, último contato e follow-up em 3 dias. */
export async function logDemoSent(
  leadId: string,
  demoSlug: string,
  message: string,
) {
  await requireAdminSession()
  const db = getDb()
  const [lead] = await db.select().from(leads).where(eq(leads.id, leadId))
  if (!lead) throw new Error('Lead não encontrado.')

  const advance = lead.stage === 'novo' || lead.stage === 'contatado'
  const now = new Date()

  await db.batch([
    db.insert(leadInteractions).values({
      leadId,
      type: 'whatsapp',
      content: message.slice(0, 2000),
      demoSlug,
    }),
    db
      .update(leads)
      .set({
        demoSlug,
        lastContactAt: now,
        updatedAt: now,
        nextActionAt: addDaysISO(todayISO(), FOLLOW_UP_DAYS),
        nextActionNote: 'Follow-up da demo',
        ...(advance
          ? { stage: 'demo_enviada' as const, stageChangedAt: now }
          : {}),
      })
      .where(eq(leads.id, leadId)),
  ])
  refresh(leadId)
}

export async function setNextAction(
  id: string,
  date: string | null,
  note: string | null,
) {
  await requireAdminSession()
  const d = date ? isoDate.parse(date) : null
  await getDb()
    .update(leads)
    .set({
      nextActionAt: d,
      nextActionNote: d ? note?.trim().slice(0, 200) || null : null,
      updatedAt: new Date(),
    })
    .where(eq(leads.id, id))
  refresh(id)
}

export async function deleteLead(id: string) {
  await requireAdminSession()
  await getDb().delete(leads).where(eq(leads.id, id))
  refresh()
}

export async function deleteLeads(ids: string[]) {
  await requireAdminSession()
  if (ids.length === 0) return
  await getDb().delete(leads).where(inArray(leads.id, ids))
  refresh()
}

export async function moveLeads(ids: string[], stage: z.infer<typeof STAGE>) {
  await requireAdminSession()
  const next = STAGE.parse(stage)
  if (ids.length === 0) return
  await getDb()
    .update(leads)
    .set({ stage: next, stageChangedAt: new Date(), updatedAt: new Date() })
    .where(inArray(leads.id, ids))
  refresh()
}

const importRow = z.object({
  name: z.string().trim().min(2).max(160),
  city: opt(80),
  phone: opt(40),
  instagram: opt(200),
  website: opt(300),
  email: opt(200),
})

/** Importa linhas já mapeadas pelo cliente; pula quem já existe (mesmo telefone ou mesmo nome). */
export async function importLeads(
  rows: z.input<typeof importRow>[],
  defaults: {
    niche: z.infer<typeof NICHE>
    source: z.infer<typeof SOURCE>
    scheduleToday: boolean
  },
) {
  await requireAdminSession()
  const niche = NICHE.parse(defaults.niche)
  const source = SOURCE.parse(defaults.source)
  const parsed = rows.slice(0, 2000).map((r) => importRow.safeParse(r))
  const valid = parsed.flatMap((p) => (p.success ? [p.data] : []))

  const db = getDb()
  const existing = await db
    .select({ name: leads.name, phone: leads.phone })
    .from(leads)
  const seenPhones = new Set(
    existing.map((e) => normalizePhone(e.phone)).filter(Boolean),
  )
  const seenNames = new Set(existing.map((e) => e.name.toLowerCase()))

  const toInsert: (typeof leads.$inferInsert)[] = []
  let skipped = 0
  for (const r of valid) {
    const phone = normalizePhone(r.phone)
    const nameKey = r.name.toLowerCase()
    if ((phone && seenPhones.has(phone)) || seenNames.has(nameKey)) {
      skipped++
      continue
    }
    if (phone) seenPhones.add(phone)
    seenNames.add(nameKey)
    toInsert.push({
      name: r.name,
      niche,
      source,
      city: r.city,
      phone: r.phone,
      instagram: r.instagram,
      website: r.website,
      email: r.email,
      siteQuality: r.website ? 'desconhecido' : 'nenhum',
      ...(defaults.scheduleToday
        ? { nextActionAt: todayISO(), nextActionNote: 'Primeiro contato' }
        : {}),
    })
  }

  for (let i = 0; i < toInsert.length; i += 200) {
    await db.insert(leads).values(toInsert.slice(i, i + 200))
  }
  refresh()
  return {
    imported: toInsert.length,
    skipped,
    invalid: parsed.length - valid.length,
  }
}

// ---- Modelos de mensagem ------------------------------------------------------

const templateSchema = z.object({
  name: z.string().trim().min(2).max(120),
  niche: NICHE.nullable(),
  body: z.string().trim().min(5).max(2000),
})

export async function saveTemplate(
  id: string | null,
  input: z.input<typeof templateSchema>,
) {
  await requireAdminSession()
  const data = templateSchema.parse(input)
  const db = getDb()
  if (id) {
    await db
      .update(messageTemplates)
      .set({ ...data, updatedAt: new Date() })
      .where(eq(messageTemplates.id, id))
  } else {
    const [{ n }] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(messageTemplates)
    await db.insert(messageTemplates).values({ ...data, position: n })
  }
  revalidatePath('/admin/modelos')
  revalidatePath('/admin', 'layout')
}

export async function deleteTemplate(id: string) {
  await requireAdminSession()
  await getDb().delete(messageTemplates).where(eq(messageTemplates.id, id))
  revalidatePath('/admin/modelos')
}

// ---- Demos ---------------------------------------------------------------------

const demoSchema = z.object({
  slug: z
    .string()
    .trim()
    .toLowerCase()
    .regex(/^[a-z0-9-]{2,60}$/, 'Use letras minúsculas, números e hífen.'),
  name: z.string().trim().min(2).max(120),
  niche: NICHE.nullable(),
  url: z.string().trim().url(),
  note: opt(300),
})

export async function saveDemo(
  id: string | null,
  input: z.input<typeof demoSchema>,
) {
  await requireAdminSession()
  const data = demoSchema.parse(input)
  const db = getDb()
  if (id) {
    await db.update(demos).set(data).where(eq(demos.id, id))
  } else {
    const [{ n }] = await db
      .select({ n: sql<number>`count(*)::int` })
      .from(demos)
    await db.insert(demos).values({ ...data, position: n })
  }
  revalidatePath('/admin/demos')
}

export async function deleteDemo(id: string) {
  await requireAdminSession()
  await getDb().delete(demos).where(eq(demos.id, id))
  revalidatePath('/admin/demos')
}

// ---- Configurações -------------------------------------------------------------

export async function setDailyGoal(goal: number) {
  await requireAdminSession()
  const value = z.number().int().min(1).max(200).parse(goal)
  await getDb()
    .insert(siteContent)
    .values({ key: 'painel_settings', value: { dailyGoal: value } })
    .onConflictDoUpdate({
      target: siteContent.key,
      set: { value: { dailyGoal: value }, updatedAt: new Date() },
    })
  revalidatePath('/admin')
}
