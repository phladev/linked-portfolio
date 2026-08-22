'use client'

import { useEffect, useState, useTransition } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import toast from 'react-hot-toast'
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from '@dnd-kit/core'
import {
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
  arrayMove,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Button } from '@/components/ui/button'
import type { Project } from '@/lib/db/queries/projects'
import {
  deleteProject,
  reorderProjects,
  toggleProjectPublished,
} from '@/app/admin/projects/actions'

const STATUS_LABEL: Record<Project['status'], string> = {
  in_progress: 'Em desenvolvimento',
  completed: 'Concluído',
  archived: 'Arquivado',
}

function SortableRow({ project }: { project: Project }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: project.id })
  const [isPending, startTransition] = useTransition()

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  }

  function handleTogglePublished() {
    startTransition(async () => {
      try {
        await toggleProjectPublished(project.id, !project.published)
      } catch {
        toast.error('Não deu pra atualizar a publicação.')
      }
    })
  }

  function handleDelete() {
    if (
      !confirm(`Excluir "${project.title}"? Essa ação não pode ser desfeita.`)
    )
      return
    startTransition(async () => {
      try {
        await deleteProject(project.id)
        toast.success('Projeto excluído.')
      } catch {
        toast.error('Não deu pra excluir o projeto.')
      }
    })
  }

  return (
    <div
      ref={setNodeRef}
      style={style}
      className="flex items-center gap-4 rounded-lg border border-white/[0.06] bg-surface p-4"
    >
      <button
        type="button"
        {...attributes}
        {...listeners}
        className="cursor-grab touch-none text-muted2 active:cursor-grabbing"
        aria-label="Arrastar para reordenar"
      >
        ⠿
      </button>

      <div className="relative h-14 w-20 shrink-0 overflow-hidden rounded-md bg-white/5">
        {project.coverUrl && (
          <Image
            src={project.coverUrl}
            alt=""
            fill
            className="object-cover"
            unoptimized
          />
        )}
      </div>

      <div className="flex min-w-0 flex-1 flex-col gap-1">
        <span className="truncate font-display text-sm font-medium text-ink">
          {project.title}
        </span>
        <span className="font-mono text-xs text-muted2">
          {STATUS_LABEL[project.status]}
        </span>
      </div>

      <button
        type="button"
        onClick={handleTogglePublished}
        disabled={isPending}
        className={`whitespace-nowrap rounded-full px-2.5 py-1 font-mono text-[11px] transition-colors ${
          project.published
            ? 'bg-[oklch(78%_0.14_150/0.12)] text-[oklch(78%_0.14_150)]'
            : 'bg-white/5 text-muted2'
        }`}
      >
        {project.published ? 'Publicado' : 'Rascunho'}
      </button>

      <Link href={`/admin/projects/${project.id}`}>
        <Button type="button" variant="outline" size="sm">
          Editar
        </Button>
      </Link>

      <Button
        type="button"
        variant="destructive"
        size="sm"
        onClick={handleDelete}
        disabled={isPending}
      >
        Excluir
      </Button>
    </div>
  )
}

export function ProjectList({ projects }: { projects: Project[] }) {
  const [items, setItems] = useState(projects)
  const [, startTransition] = useTransition()
  const sensors = useSensors(useSensor(PointerSensor))

  useEffect(() => {
    setItems(projects)
  }, [projects])

  function handleDragEnd(event: DragEndEvent) {
    const { active, over } = event
    if (!over || active.id === over.id) return

    const oldIndex = items.findIndex((item) => item.id === active.id)
    const newIndex = items.findIndex((item) => item.id === over.id)
    const next = arrayMove(items, oldIndex, newIndex)
    setItems(next)

    startTransition(async () => {
      try {
        await reorderProjects(next.map((item) => item.id))
      } catch {
        toast.error('Não deu pra salvar a nova ordem.')
        setItems(items)
      }
    })
  }

  if (items.length === 0) {
    return (
      <p className="rounded-xl border border-white/[0.06] bg-surface p-6 text-sm text-muted2">
        Nenhum projeto ainda. Crie o primeiro.
      </p>
    )
  }

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <SortableContext
        items={items.map((item) => item.id)}
        strategy={verticalListSortingStrategy}
      >
        <div className="flex flex-col gap-3">
          {items.map((project) => (
            <SortableRow key={project.id} project={project} />
          ))}
        </div>
      </SortableContext>
    </DndContext>
  )
}
