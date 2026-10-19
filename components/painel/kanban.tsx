'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import {
  DndContext,
  DragOverlay,
  KeyboardSensor,
  PointerSensor,
  TouchSensor,
  useDraggable,
  useDroppable,
  useSensor,
  useSensors,
  type DragEndEvent,
  type DragStartEvent,
} from '@dnd-kit/core'
import { moveLead } from '@/app/admin/(painel)/leads/actions'
import {
  ACTIVE_STAGES,
  NICHES,
  NICHE_LABEL,
  STAGES,
  STAGE_LABEL,
  type NicheId,
  type StageId,
} from '@/lib/leads/constants'
import { daysSince, relativeDay, todayISO } from '@/lib/leads/dates'
import { cn } from '@/lib/utils'
import { LostDialog } from './lost-dialog'
import { Tag } from './stamp'
import { inputCls } from './ui'

export type KanbanLead = {
  id: string
  name: string
  niche: NicheId
  city: string | null
  stage: StageId
  nextActionAt: string | null
  valueEstimate: number | null
  stageChangedAt: string
}

const brl = (n: number) =>
  n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })

function CardBody({ lead, today }: { lead: KanbanLead; today: string }) {
  const overdue =
    ACTIVE_STAGES.includes(lead.stage) &&
    !!lead.nextActionAt &&
    lead.nextActionAt < today
  const days = daysSince(lead.stageChangedAt)
  return (
    <>
      <p className="font-pn-display text-[17px] font-medium leading-snug tracking-[-0.01em]">
        {lead.name}
      </p>
      <p className="mt-0.5 text-[12.5px] text-pn-muted">
        {NICHE_LABEL[lead.niche]}
        {lead.city ? ` · ${lead.city}` : ''}
      </p>
      <p className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-0.5">
        {lead.nextActionAt && (
          <Tag tone={overdue ? 'signal' : 'plain'}>
            {relativeDay(lead.nextActionAt, today)}
          </Tag>
        )}
        {days !== null && days > 0 && <Tag>{days}d na etapa</Tag>}
        {lead.valueEstimate ? (
          <Tag className="ml-auto">{brl(lead.valueEstimate)}</Tag>
        ) : null}
      </p>
    </>
  )
}

function Card({
  lead,
  today,
  onMove,
}: {
  lead: KanbanLead
  today: string
  onMove: (id: string, stage: StageId) => void
}) {
  const { attributes, listeners, setNodeRef, isDragging } = useDraggable({
    id: lead.id,
  })
  return (
    <li
      ref={setNodeRef}
      className={cn(
        'touch-pan-y rounded-[3px] border border-pn-line bg-pn-card p-3 shadow-[0_1px_0_rgba(29,26,22,0.04)] transition-shadow hover:shadow-[0_8px_20px_-14px_rgba(29,26,22,0.5)]',
        isDragging && 'opacity-30',
      )}
    >
      <div
        {...attributes}
        {...listeners}
        className="cursor-grab active:cursor-grabbing"
      >
        <Link
          href={`/admin/leads/${lead.id}`}
          className="block outline-offset-4"
          draggable={false}
          aria-label={`Abrir ${lead.name}`}
        >
          <CardBody lead={lead} today={today} />
        </Link>
      </div>
      <label className="sr-only" htmlFor={`mv-${lead.id}`}>
        Mover {lead.name} para
      </label>
      <select
        id={`mv-${lead.id}`}
        value={lead.stage}
        onChange={(e) => onMove(lead.id, e.target.value as StageId)}
        className="mt-3 min-h-[34px] w-full rounded-[3px] border border-pn-line bg-pn-paper/60 px-2 font-pn-mono text-[11px] uppercase tracking-[0.06em] text-pn-muted"
      >
        {STAGES.map((s) => (
          <option key={s.id} value={s.id}>
            {s.label}
          </option>
        ))}
      </select>
    </li>
  )
}

function Column({
  stage,
  leads,
  today,
  onMove,
}: {
  stage: StageId
  leads: KanbanLead[]
  today: string
  onMove: (id: string, stage: StageId) => void
}) {
  const { setNodeRef, isOver } = useDroppable({ id: stage })
  const total = leads.reduce((s, l) => s + (l.valueEstimate ?? 0), 0)
  const closed = stage === 'fechado' || stage === 'perdido'
  return (
    <section
      aria-label={`${STAGE_LABEL[stage]}, ${leads.length} leads`}
      className={cn(
        'flex w-[282px] shrink-0 snap-start flex-col rounded-[3px] border p-2.5 transition-colors sm:w-[290px]',
        isOver ? 'border-pn-ink bg-pn-sunk' : 'border-pn-line bg-pn-sunk/45',
        closed && 'bg-transparent',
      )}
    >
      <header className="mb-2.5 flex items-baseline justify-between gap-2 px-1">
        <h2 className="font-pn-display text-[19px] font-medium leading-none tracking-[-0.01em]">
          {STAGE_LABEL[stage]}
        </h2>
        <span className="font-pn-mono text-[11px] text-pn-muted">
          {leads.length}
          {total > 0 ? ` · ${brl(total)}` : ''}
        </span>
      </header>
      <ul
        ref={setNodeRef}
        className="flex min-h-[120px] flex-1 flex-col gap-2.5"
      >
        {leads.map((l) => (
          <Card key={l.id} lead={l} today={today} onMove={onMove} />
        ))}
        {leads.length === 0 && (
          <li className="flex flex-1 items-center justify-center rounded-[3px] border border-dashed border-pn-line px-3 py-6 text-center text-[12px] text-pn-muted/80">
            Solte um lead aqui
          </li>
        )}
      </ul>
    </section>
  )
}

export function Kanban({ leads: initial }: { leads: KanbanLead[] }) {
  const router = useRouter()
  const [leads, setLeads] = useState(initial)
  const [niche, setNiche] = useState('')
  const [city, setCity] = useState('')
  const [dragging, setDragging] = useState<KanbanLead | null>(null)
  const [lost, setLost] = useState<KanbanLead | null>(null)
  const [, start] = useTransition()
  const today = todayISO()

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 6 } }),
    useSensor(TouchSensor, {
      activationConstraint: { delay: 220, tolerance: 8 },
    }),
    useSensor(KeyboardSensor),
  )

  const visible = useMemo(
    () =>
      leads.filter(
        (l) =>
          (!niche || l.niche === niche) &&
          (!city.trim() ||
            (l.city ?? '').toLowerCase().includes(city.trim().toLowerCase())),
      ),
    [leads, niche, city],
  )

  const byStage = useMemo(() => {
    const m = Object.fromEntries(
      STAGES.map((s) => [s.id, [] as KanbanLead[]]),
    ) as Record<StageId, KanbanLead[]>
    for (const l of visible) m[l.stage].push(l)
    return m
  }, [visible])

  function apply(id: string, stage: StageId, reason?: string) {
    const prev = leads
    setLeads((ls) =>
      ls.map((l) =>
        l.id === id
          ? { ...l, stage, stageChangedAt: new Date().toISOString() }
          : l,
      ),
    )
    start(async () => {
      try {
        await moveLead(id, stage, reason)
        router.refresh()
      } catch {
        setLeads(prev)
        toast.error('Não foi possível mover. Voltei o card.')
      }
    })
  }

  function request(id: string, stage: StageId) {
    const lead = leads.find((l) => l.id === id)
    if (!lead || lead.stage === stage) return
    if (stage === 'perdido') setLost(lead)
    else apply(id, stage)
  }

  function onDragStart(e: DragStartEvent) {
    setDragging(leads.find((l) => l.id === e.active.id) ?? null)
  }

  function onDragEnd(e: DragEndEvent) {
    setDragging(null)
    if (e.over) request(String(e.active.id), e.over.id as StageId)
  }

  return (
    <div>
      <div className="mb-5 grid gap-3 sm:grid-cols-[220px_220px_1fr]">
        <div>
          <label htmlFor="k-niche" className="sr-only">
            Nicho
          </label>
          <select
            id="k-niche"
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className={inputCls}
          >
            <option value="">Nicho: todos</option>
            {NICHES.map((n) => (
              <option key={n.id} value={n.id}>
                {n.label}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label htmlFor="k-city" className="sr-only">
            Cidade
          </label>
          <input
            id="k-city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            placeholder="Cidade"
            className={inputCls}
          />
        </div>
        <p className="self-center font-pn-mono text-[12px] text-pn-muted sm:text-right">
          {visible.length} lead(s) · arraste, ou use o seletor no card
        </p>
      </div>

      <DndContext
        id="funil"
        sensors={sensors}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragCancel={() => setDragging(null)}
      >
        <div className="pn-scroll -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-4 sm:-mx-8 sm:px-8 lg:-mx-12 lg:px-12">
          {STAGES.map((s) => (
            <Column
              key={s.id}
              stage={s.id}
              leads={byStage[s.id]}
              today={today}
              onMove={request}
            />
          ))}
        </div>
        <DragOverlay dropAnimation={null}>
          {dragging && (
            <div className="w-[270px] rotate-[1.5deg] rounded-[3px] border border-pn-ink bg-pn-card p-3 shadow-[0_20px_40px_-12px_rgba(29,26,22,0.55)]">
              <CardBody lead={dragging} today={today} />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      {lost && (
        <LostDialog
          name={lost.name}
          onCancel={() => setLost(null)}
          onConfirm={(reason) => {
            apply(lost.id, 'perdido', reason)
            setLost(null)
          }}
        />
      )}
    </div>
  )
}
