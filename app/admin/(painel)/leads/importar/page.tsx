import { CsvImport } from '@/components/painel/csv-import'
import { PageHeader } from '@/components/painel/ui'

export const metadata = { title: 'Importar leads' }

export default function ImportPage() {
  return (
    <>
      <PageHeader eyebrow="Leads" title="Importar lista" />
      <CsvImport />
    </>
  )
}
