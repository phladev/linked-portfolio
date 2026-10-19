import type { Lead } from '@/lib/db/queries/leads'
import type { CardLead } from '@/components/painel/lead-card'
import type { NicheId, StageId } from '@/lib/leads/constants'

/** Reduz o lead ao que os componentes de cliente precisam (datas como texto). */
export function toCard(l: Lead): CardLead {
  return {
    id: l.id,
    name: l.name,
    niche: l.niche as NicheId,
    city: l.city,
    contactName: l.contactName,
    phone: l.phone,
    stage: l.stage as StageId,
    demoSlug: l.demoSlug,
    nextActionAt: l.nextActionAt,
    nextActionNote: l.nextActionNote,
    lastContactAt: l.lastContactAt ? l.lastContactAt.toISOString() : null,
    stageChangedAt: l.stageChangedAt.toISOString(),
  }
}
