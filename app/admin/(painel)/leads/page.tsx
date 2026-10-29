import Link from 'next/link'
import { Upload } from 'lucide-react'
import { getLeads } from '@/lib/db/queries/leads'
import { LeadsTable, type TableLead } from '@/components/painel/leads-table'
import { OpenCapture } from '@/components/painel/open-capture'
import { PageHeader, buttonCls } from '@/components/painel/ui'
import type { NicheId, SourceId, StageId } from '@/lib/leads/constants'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Leads' }

export default async function LeadsPage() {
  const rows = await getLeads()
  const leads: TableLead[] = rows.map((l) => ({
    id: l.id,
    name: l.name,
    niche: l.niche as NicheId,
    city: l.city,
    contactName: l.contactName,
    phone: l.phone,
    instagram: l.instagram,
    website: l.website,
    email: l.email,
    siteQuality: l.siteQuality,
    valueEstimate: l.valueEstimate,
    notes: l.notes,
    stage: l.stage as StageId,
    source: l.source as SourceId,
    nextActionAt: l.nextActionAt,
    nextActionNote: l.nextActionNote,
    lastContactAt: l.lastContactAt ? l.lastContactAt.toISOString() : null,
    updatedAt: l.updatedAt.toISOString(),
  }))

  return (
    <>
      <PageHeader
        eyebrow={`${leads.length} no caderno`}
        title="Leads"
        actions={
          <>
            <Link href="/admin/leads/importar" className={buttonCls('outline')}>
              <Upload size={16} aria-hidden /> Importar CSV
            </Link>
            <OpenCapture />
          </>
        }
      />
      <LeadsTable leads={leads} />
    </>
  )
}
