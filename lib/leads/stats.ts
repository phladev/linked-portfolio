import {
  ACTIVE_STAGES,
  NICHES,
  RESPONDED_STAGES,
  SOURCES,
  STAGES,
  type NicheId,
  type SourceId,
  type StageId,
} from '@/lib/leads/constants'
import { addDaysISO, todayISO } from '@/lib/leads/dates'

type L = {
  niche: string
  source: string
  stage: string
  demoSlug: string | null
  lostReason: string | null
  valueEstimate: number | null
}

export function stageCounts(all: L[]) {
  return STAGES.map((s) => ({
    id: s.id as StageId,
    label: s.label,
    value: all.filter((l) => l.stage === s.id).length,
  }))
}

type Row = {
  id: string
  label: string
  total: number
  contacted: number
  responded: number
  won: number
  rate: number | null
}

function groupRows<T extends { id: string; label: string }>(
  items: readonly T[],
  all: L[],
  key: 'niche' | 'source',
): Row[] {
  return items
    .map((it) => {
      const group = all.filter((l) => l[key] === it.id)
      const contacted = group.filter((l) => l.stage !== 'novo').length
      const responded = group.filter((l) =>
        (RESPONDED_STAGES as string[]).includes(l.stage),
      ).length
      return {
        id: it.id,
        label: it.label,
        total: group.length,
        contacted,
        responded,
        won: group.filter((l) => l.stage === 'fechado').length,
        rate: contacted > 0 ? responded / contacted : null,
      }
    })
    .filter((r) => r.total > 0)
}

export const byNiche = (all: L[]) => groupRows(NICHES, all, 'niche')
export const bySource = (all: L[]) => groupRows(SOURCES, all, 'source')

/** Contatos por dia nos últimos 14 dias (fuso de São Paulo). */
export function dailyContacts(recent: { createdAt: Date }[], days = 14) {
  const today = todayISO()
  const counts = new Map<string, number>()
  for (const r of recent) {
    const d = r.createdAt.toLocaleDateString('en-CA', {
      timeZone: 'America/Sao_Paulo',
    })
    counts.set(d, (counts.get(d) ?? 0) + 1)
  }
  return Array.from({ length: days }, (_, i) => {
    const date = addDaysISO(today, i - (days - 1))
    return { date, value: counts.get(date) ?? 0 }
  })
}

export function demoStats(
  demos: { slug: string; name: string; niche: string | null; url: string }[],
  sends: { leadId: string; demoSlug: string | null }[],
  all: (L & { id: string })[],
) {
  return demos.map((d) => {
    const sentTo = new Set(
      sends.filter((s) => s.demoSlug === d.slug).map((s) => s.leadId),
    )
    const leads = all.filter((l) => sentTo.has(l.id))
    const responded = leads.filter((l) =>
      (RESPONDED_STAGES as string[]).includes(l.stage),
    ).length
    return {
      ...d,
      sends: sends.filter((s) => s.demoSlug === d.slug).length,
      leads: leads.length,
      responded,
      won: leads.filter((l) => l.stage === 'fechado').length,
      rate: leads.length > 0 ? responded / leads.length : null,
    }
  })
}

export function lostReasons(all: L[]) {
  const m = new Map<string, number>()
  for (const l of all) {
    if (l.stage !== 'perdido') continue
    const r = (l.lostReason ?? '').trim() || 'Sem motivo informado'
    m.set(r, (m.get(r) ?? 0) + 1)
  }
  return [...m.entries()]
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
}

export function totals(all: L[]) {
  const active = all.filter((l) =>
    (ACTIVE_STAGES as string[]).includes(l.stage),
  )
  const contacted = all.filter((l) => l.stage !== 'novo')
  const responded = all.filter((l) =>
    (RESPONDED_STAGES as string[]).includes(l.stage),
  )
  return {
    total: all.length,
    active: active.length,
    contacted: contacted.length,
    responded: responded.length,
    won: all.filter((l) => l.stage === 'fechado').length,
    lost: all.filter((l) => l.stage === 'perdido').length,
    pipeline: active.reduce((s, l) => s + (l.valueEstimate ?? 0), 0),
    wonValue: all
      .filter((l) => l.stage === 'fechado')
      .reduce((s, l) => s + (l.valueEstimate ?? 0), 0),
    rate: contacted.length > 0 ? responded.length / contacted.length : null,
  }
}

export type { NicheId, SourceId }
