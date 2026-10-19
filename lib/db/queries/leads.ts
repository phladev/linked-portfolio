import {
  and,
  asc,
  desc,
  eq,
  gte,
  inArray,
  isNotNull,
  lte,
  sql,
} from 'drizzle-orm'
import { getDb } from '@/lib/db/client'
import {
  demos,
  leadInteractions,
  leads,
  messageTemplates,
  siteContent,
} from '@/lib/db/schema'
import {
  ACTIVE_STAGES,
  CONTACT_TYPES,
  COOLING_DAYS,
  DEFAULT_DAILY_GOAL,
  RESPONDED_STAGES,
} from '@/lib/leads/constants'
import {
  addDaysISO,
  daysSince,
  startOfTodaySP,
  todayISO,
} from '@/lib/leads/dates'

export type Lead = typeof leads.$inferSelect
export type Interaction = typeof leadInteractions.$inferSelect
export type Template = typeof messageTemplates.$inferSelect
export type Demo = typeof demos.$inferSelect

export async function getLeads() {
  return getDb().select().from(leads).orderBy(desc(leads.updatedAt))
}

export async function getLead(id: string) {
  const [lead] = await getDb().select().from(leads).where(eq(leads.id, id))
  return lead
}

export async function getInteractions(leadId: string) {
  return getDb()
    .select()
    .from(leadInteractions)
    .where(eq(leadInteractions.leadId, leadId))
    .orderBy(desc(leadInteractions.createdAt))
}

export async function getDemos() {
  return getDb().select().from(demos).orderBy(asc(demos.position))
}

export async function getTemplates() {
  return getDb()
    .select()
    .from(messageTemplates)
    .orderBy(asc(messageTemplates.position))
}

const SETTINGS_KEY = 'painel_settings'

export async function getDailyGoal() {
  const [row] = await getDb()
    .select()
    .from(siteContent)
    .where(eq(siteContent.key, SETTINGS_KEY))
  const goal = Number(
    (row?.value as { dailyGoal?: number } | undefined)?.dailyGoal,
  )
  return Number.isFinite(goal) && goal > 0 ? goal : DEFAULT_DAILY_GOAL
}

/** Tudo o que a tela "Hoje" precisa, em poucas consultas. */
export async function getToday() {
  const db = getDb()
  const today = todayISO()

  const active = await db
    .select()
    .from(leads)
    .where(inArray(leads.stage, ACTIVE_STAGES))
    .orderBy(asc(leads.nextActionAt), desc(leads.updatedAt))

  const due = active.filter((l) => l.nextActionAt && l.nextActionAt <= today)
  const overdue = due.filter((l) => l.nextActionAt! < today)
  const dueToday = due.filter((l) => l.nextActionAt === today)

  const dueIds = new Set(due.map((l) => l.id))
  const cooling = active
    .filter((l) => !dueIds.has(l.id) && l.stage !== 'novo')
    .filter((l) => {
      const idle = daysSince(l.lastContactAt ?? l.stageChangedAt)
      return (
        idle !== null &&
        idle >= COOLING_DAYS &&
        !(l.nextActionAt && l.nextActionAt > today)
      )
    })

  const untouched = active.filter(
    (l) => l.stage === 'novo' && !dueIds.has(l.id) && !l.nextActionAt,
  )

  const [{ n: contactsToday }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(leadInteractions)
    .where(
      and(
        inArray(leadInteractions.type, CONTACT_TYPES as never[]),
        gte(leadInteractions.createdAt, startOfTodaySP()),
      ),
    )

  const [{ n: totalLeads }] = await db
    .select({ n: sql<number>`count(*)::int` })
    .from(leads)

  return {
    today,
    overdue,
    dueToday,
    cooling,
    untouched,
    activeCount: active.length,
    totalLeads,
    contactsToday,
    goal: await getDailyGoal(),
    upcoming: active
      .filter(
        (l) =>
          l.nextActionAt &&
          l.nextActionAt > today &&
          l.nextActionAt <= addDaysISO(today, 7),
      )
      .slice(0, 6),
  }
}

export async function getMetrics() {
  const db = getDb()
  const all = await db.select().from(leads)

  const since = new Date(startOfTodaySP().getTime() - 13 * 86_400_000)
  const recent = await db
    .select({
      createdAt: leadInteractions.createdAt,
      type: leadInteractions.type,
    })
    .from(leadInteractions)
    .where(
      and(
        gte(leadInteractions.createdAt, since),
        inArray(leadInteractions.type, CONTACT_TYPES as never[]),
      ),
    )

  const demoSends = await db
    .select({
      leadId: leadInteractions.leadId,
      demoSlug: leadInteractions.demoSlug,
    })
    .from(leadInteractions)
    .where(
      and(
        isNotNull(leadInteractions.demoSlug),
        lte(leadInteractions.createdAt, new Date()),
      ),
    )

  return {
    all,
    recent,
    demoSends,
    demos: await getDemos(),
    responded: RESPONDED_STAGES,
  }
}

/** Quantos leads pedem ação hoje ou estão atrasados (badge do menu). */
export async function getDueCount() {
  const [{ n }] = await getDb()
    .select({ n: sql<number>`count(*)::int` })
    .from(leads)
    .where(
      and(
        inArray(leads.stage, ACTIVE_STAGES),
        isNotNull(leads.nextActionAt),
        lte(leads.nextActionAt, todayISO()),
      ),
    )
  return n
}
