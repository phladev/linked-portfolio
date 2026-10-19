'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useMemo, useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { Search, Upload } from 'lucide-react'
import { deleteLeads, moveLeads } from '@/app/admin/(painel)/leads/actions'
import {
  ACTIVE_STAGES,
  NICHES,
  NICHE_LABEL,
  SOURCES,
  SOURCE_LABEL,
  STAGES,
  type NicheId,
  type SourceId,
  type StageId,
} from '@/lib/leads/constants'
import { daysSince, relativeDay, todayISO } from '@/lib/leads/dates'
import { cn } from '@/lib/utils'
import { Btn, Empty, buttonCls, inputCls } from './ui'
import { OpenCapture } from './open-capture'
import { Stamp, Tag } from './stamp'

export type TableLead = {
  id: string
  name: string
  niche: NicheId
  city: string | null
  phone: string | null
  stage: StageId
  source: SourceId
  nextActionAt: string | null
  nextActionNote: string | null
  lastContactAt: string | null
  updatedAt: string
}

type Sort = 'recentes' | 'nome' | 'acao'
const PAGE = 60

export function LeadsTable({ leads }: { leads: TableLead[] }) {
  const router = useRouter()
  const [q, setQ] = useState('')
  const [stage, setStage] = useState('')
  const [niche, setNiche] = useState('')
  const [source, setSource] = useState('')
  const [onlyDue, setOnlyDue] = useState(false)
  const [sort, setSort] = useState<Sort>('recentes')
  const [limit, setLimit] = useState(PAGE)
  const [sel, setSel] = useState<Set<string>>(new Set())
  const [pending, start] = useTransition()
  const today = todayISO()

  const filtered = useMemo(() => {
    const term = q.trim().toLowerCase()
    const list = leads.filter((l) => {
      if (stage && l.stage !== stage) return false
      if (niche && l.niche !== niche) return false
      if (source && l.source !== source) return false
      if (
        onlyDue &&
        !(
          ACTIVE_STAGES.includes(l.stage) &&
          l.nextActionAt &&
          l.nextActionAt <= today
        )
      )
        return false
      if (term) {
        const hay = `${l.name} ${l.city ?? ''} ${l.phone ?? ''}`.toLowerCase()
        if (!hay.includes(term)) return false
      }
      return true
    })
    if (sort === 'nome')
      list.sort((a, b) => a.name.localeCompare(b.name, 'pt-BR'))
    if (sort === 'acao')
      list.sort((a, b) =>
        (a.nextActionAt ?? '9999').localeCompare(b.nextActionAt ?? '9999'),
      )
    return list
  }, [leads, q, stage, niche, source, onlyDue, sort, today])

  const visible = filtered.slice(0, limit)
  const allSelected = visible.length > 0 && visible.every((l) => sel.has(l.id))

  function toggle(id: string) {
    setSel((s) => {
      const n = new Set(s)
      if (n.has(id)) n.delete(id)
      else n.add(id)
      return n
    })
  }

  function bulkMove(to: StageId) {
    start(async () => {
      await moveLeads([...sel], to)
      toast.success(`${sel.size} lead(s) movido(s).`)
      setSel(new Set())
      router.refresh()
    })
  }

  function bulkDelete() {
    if (
      !window.confirm(
        `Excluir ${sel.size} lead(s)? Isso não pode ser desfeito.`,
      )
    )
      return
    start(async () => {
      await deleteLeads([...sel])
      toast.success('Leads excluídos.')
      setSel(new Set())
      router.refresh()
    })
  }

  if (leads.length === 0) {
    return (
      <Empty
        title="Nenhum lead ainda."
        action={
          <div className="flex flex-wrap justify-center gap-2">
            <OpenCapture variant="ink">Novo lead</OpenCapture>
            <Link href="/admin/leads/importar" className={buttonCls('outline')}>
              <Upload size={16} aria-hidden /> Importar CSV
            </Link>
          </div>
        }
      >
        Cadastre o primeiro ou traga uma lista inteira de uma vez.
      </Empty>
    )
  }

  return (
    <div>
      <div className="mb-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-[1.6fr_1fr_1fr_1fr_1fr]">
        <div className="relative sm:col-span-2 lg:col-span-1">
          <label htmlFor="lead-q" className="sr-only">
            Buscar
          </label>
          <Search
            size={16}
            aria-hidden
            className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-pn-muted"
          />
          <input
            id="lead-q"
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar nome, cidade ou telefone"
            className={cn(inputCls, 'pl-9')}
          />
        </div>
        <Filter
          label="Etapa"
          value={stage}
          onChange={setStage}
          options={STAGES.map((s) => [s.id, s.label])}
        />
        <Filter
          label="Nicho"
          value={niche}
          onChange={setNiche}
          options={NICHES.map((n) => [n.id, n.label])}
        />
        <Filter
          label="Origem"
          value={source}
          onChange={setSource}
          options={SOURCES.map((s) => [s.id, s.label])}
        />
        <div>
          <label htmlFor="lead-sort" className="sr-only">
            Ordenar
          </label>
          <select
            id="lead-sort"
            value={sort}
            onChange={(e) => setSort(e.target.value as Sort)}
            className={inputCls}
          >
            <option value="recentes">Mais recentes</option>
            <option value="acao">Próxima ação</option>
            <option value="nome">Nome (A–Z)</option>
          </select>
        </div>
      </div>

      <div className="mb-3 flex flex-wrap items-center justify-between gap-3">
        <label className="flex min-h-[40px] cursor-pointer items-center gap-2.5 text-[14px]">
          <input
            type="checkbox"
            checked={onlyDue}
            onChange={(e) => setOnlyDue(e.target.checked)}
            className="h-4 w-4 accent-[rgb(var(--pn-ink))]"
          />
          Só com retorno vencido ou para hoje
        </label>
        <p className="font-pn-mono text-[12px] text-pn-muted">
          {filtered.length} de {leads.length}
        </p>
      </div>

      {sel.size > 0 && (
        <div
          role="region"
          aria-label="Ações em lote"
          className="sticky top-14 z-20 mb-3 flex flex-wrap items-center gap-2 rounded-[3px] border border-pn-ink bg-pn-ink px-3 py-2 text-pn-paper lg:top-3"
        >
          <span className="mr-auto font-pn-mono text-[12px]">
            {sel.size} selecionado(s)
          </span>
          <label className="sr-only" htmlFor="bulk-stage">
            Mover para
          </label>
          <select
            id="bulk-stage"
            defaultValue=""
            disabled={pending}
            onChange={(e) =>
              e.target.value && bulkMove(e.target.value as StageId)
            }
            className="min-h-[36px] rounded-[3px] border border-pn-paper/30 bg-transparent px-2 text-[13px] text-pn-paper"
          >
            <option value="" className="text-pn-ink">
              Mover para…
            </option>
            {STAGES.map((s) => (
              <option key={s.id} value={s.id} className="text-pn-ink">
                {s.label}
              </option>
            ))}
          </select>
          <Btn
            size="sm"
            variant="signal"
            onClick={bulkDelete}
            disabled={pending}
          >
            Excluir
          </Btn>
          <Btn
            size="sm"
            variant="ghost"
            className="!text-pn-paper hover:!bg-pn-paper/10"
            onClick={() => setSel(new Set())}
          >
            Limpar
          </Btn>
        </div>
      )}

      {filtered.length === 0 ? (
        <Empty title="Nada com esses filtros.">
          Tente remover algum filtro ou mudar a busca.
        </Empty>
      ) : (
        <div className="overflow-hidden rounded-[3px] border border-pn-line bg-pn-card">
          <div className="hidden grid-cols-[36px_minmax(0,2.2fr)_1fr_1.1fr_1.4fr] items-center gap-3 border-b border-pn-line bg-pn-sunk/60 px-4 py-2.5 font-pn-mono text-[10.5px] uppercase tracking-[0.12em] text-pn-muted md:grid">
            <input
              type="checkbox"
              aria-label="Selecionar todos os visíveis"
              checked={allSelected}
              onChange={() =>
                setSel(
                  allSelected ? new Set() : new Set(visible.map((l) => l.id)),
                )
              }
              className="h-4 w-4 accent-[rgb(var(--pn-ink))]"
            />
            <span>Negócio</span>
            <span>Nicho</span>
            <span>Etapa</span>
            <span>Próxima ação</span>
          </div>
          <ul className="divide-y divide-pn-line">
            {visible.map((l) => {
              const overdue =
                ACTIVE_STAGES.includes(l.stage) &&
                !!l.nextActionAt &&
                l.nextActionAt < today
              const idle = daysSince(l.lastContactAt)
              return (
                <li
                  key={l.id}
                  className={cn(
                    'grid grid-cols-[28px_1fr] items-start gap-3 px-4 py-3 transition-colors hover:bg-pn-sunk/50 md:grid-cols-[36px_minmax(0,2.2fr)_1fr_1.1fr_1.4fr] md:items-center',
                    sel.has(l.id) && 'bg-pn-sunk/70',
                  )}
                >
                  <input
                    type="checkbox"
                    aria-label={`Selecionar ${l.name}`}
                    checked={sel.has(l.id)}
                    onChange={() => toggle(l.id)}
                    className="mt-1 h-4 w-4 accent-[rgb(var(--pn-ink))] md:mt-0"
                  />
                  <div className="min-w-0">
                    <Link
                      href={`/admin/leads/${l.id}`}
                      className="block truncate font-pn-display text-[18px] font-medium leading-tight underline-offset-4 hover:underline"
                    >
                      {l.name}
                    </Link>
                    <p className="mt-0.5 truncate text-[12.5px] text-pn-muted">
                      {l.city ?? 'sem cidade'} · {SOURCE_LABEL[l.source]}
                      {idle !== null && ACTIVE_STAGES.includes(l.stage)
                        ? ` · ${idle}d sem contato`
                        : ''}
                    </p>
                  </div>
                  <span className="col-start-2 text-[13px] text-pn-ink/80 md:col-start-auto">
                    {NICHE_LABEL[l.niche]}
                  </span>
                  <span className="col-start-2 md:col-start-auto">
                    <Stamp stage={l.stage} />
                  </span>
                  <span className="col-start-2 md:col-start-auto">
                    {l.nextActionAt ? (
                      <Tag tone={overdue ? 'signal' : 'plain'}>
                        {relativeDay(l.nextActionAt, today)}
                        {l.nextActionNote ? ` · ${l.nextActionNote}` : ''}
                      </Tag>
                    ) : (
                      <span className="text-[12px] text-pn-muted/70">
                        sem data
                      </span>
                    )}
                  </span>
                </li>
              )
            })}
          </ul>
        </div>
      )}

      {filtered.length > limit && (
        <div className="mt-4 flex justify-center">
          <Btn variant="outline" onClick={() => setLimit((n) => n + PAGE)}>
            Mostrar mais ({filtered.length - limit})
          </Btn>
        </div>
      )}
    </div>
  )
}

function Filter({
  label,
  value,
  onChange,
  options,
}: {
  label: string
  value: string
  onChange: (v: string) => void
  options: (readonly [string, string])[]
}) {
  const id = `f-${label}`
  return (
    <div>
      <label htmlFor={id} className="sr-only">
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={inputCls}
      >
        <option value="">{label}: todos</option>
        {options.map(([v, l]) => (
          <option key={v} value={v}>
            {l}
          </option>
        ))}
      </select>
    </div>
  )
}
