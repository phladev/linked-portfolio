import Link from 'next/link'
import { notFound } from 'next/navigation'
import { ProjectForm } from '@/components/admin/project-form'
import { updateProject } from '@/app/admin/projects/actions'
import { getProjectById } from '@/lib/db/queries/projects'

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()

  return (
    <div className="flex min-h-screen flex-col gap-8 bg-canvas px-6 py-10 sm:px-10">
      <div className="flex flex-col gap-2">
        <Link
          href="/admin/projects"
          className="font-mono text-sm text-accent-purple"
        >
          &lt;painel/projetos&gt;
        </Link>
        <h1 className="font-display text-2xl font-medium text-ink">
          Editar projeto
        </h1>
      </div>

      <ProjectForm project={project} action={updateProject.bind(null, id)} />
    </div>
  )
}
