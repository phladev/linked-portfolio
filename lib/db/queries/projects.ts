import { asc, eq } from 'drizzle-orm'
import { getDb } from '@/lib/db/client'
import { projects } from '@/lib/db/schema'

export type Project = typeof projects.$inferSelect
export type NewProject = typeof projects.$inferInsert

export async function getPublishedProjects() {
  return getDb()
    .select()
    .from(projects)
    .where(eq(projects.published, true))
    .orderBy(asc(projects.position))
}

export async function getAllProjects() {
  return getDb().select().from(projects).orderBy(asc(projects.position))
}

export async function getProjectById(id: string) {
  const [project] = await getDb()
    .select()
    .from(projects)
    .where(eq(projects.id, id))
  return project
}
