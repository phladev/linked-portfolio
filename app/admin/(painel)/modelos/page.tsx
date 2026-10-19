import { getTemplates } from '@/lib/db/queries/leads'
import {
  TemplatesEditor,
  type TemplateRow,
} from '@/components/painel/templates-editor'
import { PageHeader } from '@/components/painel/ui'
import type { NicheId } from '@/lib/leads/constants'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Modelos' }

export default async function ModelosPage() {
  const rows = await getTemplates()
  const templates: TemplateRow[] = rows.map((t) => ({
    id: t.id,
    name: t.name,
    niche: t.niche as NicheId | null,
    body: t.body,
  }))

  return (
    <>
      <PageHeader eyebrow="Mensagens prontas" title="Modelos" />
      <TemplatesEditor
        key={templates.map((t) => t.id).join()}
        templates={templates}
      />
    </>
  )
}
