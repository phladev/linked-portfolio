'use client'

import { useState, useTransition } from 'react'
import Image from 'next/image'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import type { Project } from '@/lib/db/queries/projects'

type ProjectFormProps = {
  project?: Project
  action: (formData: FormData) => Promise<void>
}

const STATUS_OPTIONS = [
  { value: 'in_progress', label: 'Em desenvolvimento' },
  { value: 'completed', label: 'Concluído' },
  { value: 'archived', label: 'Arquivado' },
] as const

export function ProjectForm({ project, action }: ProjectFormProps) {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()
  const [preview, setPreview] = useState<string | null>(
    project?.coverUrl ?? null,
  )

  function handleFileChange(event: React.ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0]
    if (!file) return
    setPreview(URL.createObjectURL(file))
  }

  function handleSubmit(formData: FormData) {
    startTransition(async () => {
      try {
        await action(formData)
        toast.success(project ? 'Projeto atualizado.' : 'Projeto criado.')
        router.push('/admin/projects')
      } catch (error) {
        toast.error(error instanceof Error ? error.message : 'Algo deu errado.')
      }
    })
  }

  return (
    <form
      action={handleSubmit}
      className="flex max-w-xl flex-col gap-5 rounded-xl border border-white/[0.06] bg-surface p-6"
    >
      <div className="flex flex-col gap-1.5">
        <label htmlFor="title" className="text-sm text-muted2">
          Título
        </label>
        <Input
          id="title"
          name="title"
          defaultValue={project?.title}
          required
          maxLength={120}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="description" className="text-sm text-muted2">
          Descrição
        </label>
        <Textarea
          id="description"
          name="description"
          defaultValue={project?.description}
          required
          maxLength={500}
          rows={3}
        />
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="tags" className="text-sm text-muted2">
          Tags (separadas por vírgula)
        </label>
        <Input
          id="tags"
          name="tags"
          defaultValue={project?.tags.join(', ')}
          placeholder="Next.js, Tailwind CSS, Vercel"
        />
      </div>

      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        <div className="flex flex-col gap-1.5">
          <label htmlFor="repoUrl" className="text-sm text-muted2">
            Repositório (opcional)
          </label>
          <Input
            id="repoUrl"
            name="repoUrl"
            type="url"
            defaultValue={project?.repoUrl ?? ''}
            placeholder="https://github.com/..."
          />
        </div>
        <div className="flex flex-col gap-1.5">
          <label htmlFor="deployUrl" className="text-sm text-muted2">
            Deploy (opcional)
          </label>
          <Input
            id="deployUrl"
            name="deployUrl"
            type="url"
            defaultValue={project?.deployUrl ?? ''}
            placeholder="https://..."
          />
        </div>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="status" className="text-sm text-muted2">
          Status
        </label>
        <select
          id="status"
          name="status"
          defaultValue={project?.status ?? 'in_progress'}
          className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          {STATUS_OPTIONS.map((option) => (
            <option
              key={option.value}
              value={option.value}
              className="bg-surface"
            >
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div className="flex flex-col gap-1.5">
        <label htmlFor="cover" className="text-sm text-muted2">
          Capa (PNG, JPEG ou WebP, até 4MB)
        </label>
        <Input
          id="cover"
          name="cover"
          type="file"
          accept="image/png,image/jpeg,image/webp"
          onChange={handleFileChange}
        />
        {preview && (
          <div className="relative mt-2 h-32 w-full overflow-hidden rounded-lg border border-white/[0.06]">
            <Image
              src={preview}
              alt="Pré-visualização da capa"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        )}
      </div>

      <label className="flex items-center gap-2 text-sm text-muted2">
        <input
          type="checkbox"
          name="published"
          defaultChecked={project?.published ?? false}
          className="h-4 w-4 rounded border-white/20 bg-transparent"
        />
        Publicado no site
      </label>

      <div className="flex flex-col gap-1">
        <label className="flex items-center gap-2 text-sm text-muted2">
          <input
            type="checkbox"
            name="featured"
            defaultChecked={project?.featured ?? false}
            className="h-4 w-4 rounded border-white/20 bg-transparent"
          />
          Projeto em destaque
        </label>
        <p className="pl-6 text-xs text-muted2/80">
          Aparece na seção de destaques, com a capa em evidência. Use uma capa
          horizontal (16:10).
        </p>
      </div>

      <div className="flex items-center gap-3 pt-2">
        <Button type="submit" disabled={isPending}>
          {isPending ? 'Salvando...' : 'Salvar'}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={() => router.push('/admin/projects')}
          disabled={isPending}
        >
          Cancelar
        </Button>
      </div>
    </form>
  )
}
