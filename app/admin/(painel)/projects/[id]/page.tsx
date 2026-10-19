import { notFound } from 'next/navigation'
import { ProjectForm } from '@/components/admin/project-form'
import { PageHeader } from '@/components/painel/ui'
import { updateProject } from '@/app/admin/(painel)/projects/actions'
import { getProjectById } from '@/lib/db/queries/projects'

export const metadata = { title: 'Editar projeto' }

export default async function EditProjectPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const project = await getProjectById(id)
  if (!project) notFound()

  return (
    <>
      <PageHeader eyebrow="Projetos" title="Editar projeto" />
      <ProjectForm project={project} action={updateProject.bind(null, id)} />
    </>
  )
}
