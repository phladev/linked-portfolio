import Link from 'next/link'
import { ProjectList } from '@/components/admin/project-list'
import { Button } from '@/components/ui/button'
import { getAllProjects } from '@/lib/db/queries/projects'

export default async function AdminProjectsPage() {
  const projects = await getAllProjects()

  return (
    <div className="flex min-h-screen flex-col gap-8 bg-canvas px-6 py-10 sm:px-10">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-2">
          <Link href="/admin" className="font-mono text-sm text-accent-purple">
            &lt;painel/&gt;
          </Link>
          <h1 className="font-display text-2xl font-medium text-ink">
            Projetos
          </h1>
        </div>
        <Link href="/admin/projects/new">
          <Button type="button">Novo projeto</Button>
        </Link>
      </div>

      <ProjectList projects={projects} />
    </div>
  )
}
