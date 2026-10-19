import Link from 'next/link'
import { ProjectList } from '@/components/admin/project-list'
import { Button } from '@/components/ui/button'
import { PageHeader } from '@/components/painel/ui'
import { getAllProjects } from '@/lib/db/queries/projects'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Projetos' }

export default async function AdminProjectsPage() {
  const projects = await getAllProjects()

  return (
    <>
      <PageHeader
        eyebrow="Portfólio público"
        title="Projetos"
        actions={
          <Link href="/admin/projects/new">
            <Button type="button">Novo projeto</Button>
          </Link>
        }
      />
      <ProjectList projects={projects} />
    </>
  )
}
