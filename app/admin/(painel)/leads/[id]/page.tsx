import { notFound } from 'next/navigation'
import { z } from 'zod'
import { getInteractions, getLead } from '@/lib/db/queries/leads'
import {
  LeadDetail,
  type DetailInteraction,
  type DetailLead,
} from '@/components/painel/lead-detail'
import { Stamp } from '@/components/painel/stamp'
import { PageHeader } from '@/components/painel/ui'
import {
  NICHE_LABEL,
  type InteractionTypeId,
  type NicheId,
  type SiteQualityId,
  type SourceId,
  type StageId,
} from '@/lib/leads/constants'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Lead' }

export default async function LeadPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  if (!z.string().uuid().safeParse(id).success) notFound()

  const [lead, rows] = await Promise.all([getLead(id), getInteractions(id)])
  if (!lead) notFound()

  const detail: DetailLead = {
    id: lead.id,
    name: lead.name,
    niche: lead.niche as NicheId,
    city: lead.city,
    contactName: lead.contactName,
    phone: lead.phone,
    instagram: lead.instagram,
    website: lead.website,
    email: lead.email,
    source: lead.source as SourceId,
    stage: lead.stage as StageId,
    siteQuality: lead.siteQuality as SiteQualityId,
    runsAds: lead.runsAds,
    demoSlug: lead.demoSlug,
    nextActionAt: lead.nextActionAt,
    nextActionNote: lead.nextActionNote,
    valueEstimate: lead.valueEstimate,
    lostReason: lead.lostReason,
    notes: lead.notes,
    lastContactAt: lead.lastContactAt ? lead.lastContactAt.toISOString() : null,
    stageChangedAt: lead.stageChangedAt.toISOString(),
    createdAt: lead.createdAt.toISOString(),
  }
  const interactions: DetailInteraction[] = rows.map((r) => ({
    id: r.id,
    type: r.type as InteractionTypeId,
    content: r.content,
    demoSlug: r.demoSlug,
    createdAt: r.createdAt.toISOString(),
  }))

  return (
    <>
      <PageHeader
        eyebrow={`${NICHE_LABEL[detail.niche]}${detail.city ? ` · ${detail.city}` : ''}`}
        title={detail.name}
        actions={<Stamp stage={detail.stage} className="text-[12px]" />}
      />
      <LeadDetail lead={detail} interactions={interactions} />
    </>
  )
}
