import { getLeads } from '@/lib/db/queries/leads'
import { Kanban, type KanbanLead } from '@/components/painel/kanban'
import { OpenCapture } from '@/components/painel/open-capture'
import { PageHeader } from '@/components/painel/ui'
import type { NicheId, StageId } from '@/lib/leads/constants'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Funil' }

export default async function FunilPage() {
  const rows = await getLeads()
  const leads: KanbanLead[] = rows.map((l) => ({
    id: l.id,
    name: l.name,
    niche: l.niche as NicheId,
    city: l.city,
    stage: l.stage as StageId,
    nextActionAt: l.nextActionAt,
    valueEstimate: l.valueEstimate,
    stageChangedAt: l.stageChangedAt.toISOString(),
  }))

  return (
    <>
      <PageHeader
        eyebrow="Do achado ao fechado"
        title="Funil"
        actions={<OpenCapture />}
      />
      <Kanban leads={leads} />
    </>
  )
}
