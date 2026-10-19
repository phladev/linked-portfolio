import { getMetrics } from '@/lib/db/queries/leads'
import { DemosManager, type DemoRow } from '@/components/painel/demos-manager'
import { PageHeader } from '@/components/painel/ui'
import { demoStats } from '@/lib/leads/stats'
import type { NicheId } from '@/lib/leads/constants'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Demos' }

export default async function DemosPage() {
  const m = await getMetrics()
  const stats = demoStats(m.demos, m.demoSends, m.all as never)
  const rows: DemoRow[] = stats.map((s) => {
    const d = m.demos.find((x) => x.slug === s.slug)!
    return {
      id: d.id,
      slug: d.slug,
      name: d.name,
      niche: d.niche as NicheId | null,
      url: d.url,
      note: d.note,
      leads: s.leads,
      sends: s.sends,
      responded: s.responded,
      won: s.won,
      rate: s.rate,
    }
  })

  return (
    <>
      <PageHeader eyebrow="O que você mostra para vender" title="Demos" />
      <DemosManager demos={rows} />
    </>
  )
}
