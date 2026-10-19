import { ProjectForm } from '@/components/admin/project-form'
import { PageHeader } from '@/components/painel/ui'
import { createProject } from '@/app/admin/(painel)/projects/actions'

export const metadata = { title: 'Novo projeto' }

export default function NewProjectPage() {
  return (
    <>
      <PageHeader eyebrow="Projetos" title="Novo projeto" />
      <ProjectForm action={createProject} />
    </>
  )
}
