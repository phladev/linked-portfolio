'use client'

import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { ExternalLink, Pencil, Plus, Trash2 } from 'lucide-react'
import { deleteDemo, saveDemo } from '@/app/admin/(painel)/leads/actions'
import { NICHES, NICHE_LABEL, type NicheId } from '@/lib/leads/constants'
import { Btn, Field, inputCls } from './ui'

export type DemoRow = {
  id: string
  slug: string
  name: string
  niche: NicheId | null
  url: string
  note: string | null
  leads: number
  sends: number
  responded: number
  won: number
  rate: number | null
}

type Draft = {
  id: string | null
  slug: string
  name: string
  niche: NicheId | ''
  url: string
  note: string
}
const EMPTY: Draft = {
  id: null,
  slug: '',
  name: '',
  niche: '',
  url: 'https://',
  note: '',
}

const slugify = (s: string) =>
  s
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '')
    .slice(0, 60)

export function DemosManager({ demos }: { demos: DemoRow[] }) {
  const router = useRouter()
  const [draft, setDraft] = useState<Draft | null>(null)
  const [pending, start] = useTransition()

  function save() {
    if (!draft) return
    start(async () => {
      try {
        await saveDemo(draft.id, {
          slug: draft.slug,
          name: draft.name,
          niche: draft.niche || null,
          url: draft.url,
          note: draft.note,
        })
        toast.success('Demo salva.')
        setDraft(null)
        router.refresh()
      } catch {
        toast.error(
          'Confira os campos: o endereço precisa ser uma URL e o código só pode ter letras minúsculas, números e hífen.',
        )
      }
    })
  }

  return (
    <div>
      <ul className="grid gap-4 md:grid-cols-2">
        {demos.map((d) => (
          <li
            key={d.id}
            className="flex flex-col rounded-[3px] border border-pn-line bg-pn-card p-5"
          >
            <div className="flex items-start justify-between gap-3">
              <div className="min-w-0">
                <h2 className="font-pn-display text-[24px] font-medium leading-tight tracking-[-0.02em]">
                  {d.name}
                </h2>
                <p className="mt-1 font-pn-mono text-[11px] uppercase tracking-[0.1em] text-pn-muted">
                  {d.niche ? NICHE_LABEL[d.niche] : 'Qualquer nicho'}
                </p>
              </div>
              <div className="flex shrink-0">
                <button
                  type="button"
                  aria-label={`Editar ${d.name}`}
                  onClick={() =>
                    setDraft({
                      id: d.id,
                      slug: d.slug,
                      name: d.name,
                      niche: d.niche ?? '',
                      url: d.url,
                      note: d.note ?? '',
                    })
                  }
                  className="flex h-10 w-10 items-center justify-center rounded-[3px] text-pn-muted hover:bg-pn-sunk hover:text-pn-ink"
                >
                  <Pencil size={16} />
                </button>
                <button
                  type="button"
                  aria-label={`Excluir ${d.name}`}
                  onClick={() => {
                    if (
                      !window.confirm(
                        `Excluir a demo "${d.name}"? O histórico de envios continua nos leads.`,
                      )
                    )
                      return
                    start(async () => {
                      await deleteDemo(d.id)
                      router.refresh()
                    })
                  }}
                  className="flex h-10 w-10 items-center justify-center rounded-[3px] text-pn-muted hover:bg-pn-signal/10 hover:text-pn-signal"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
            {d.note && (
              <p className="mt-2 text-[14px] text-pn-muted">{d.note}</p>
            )}
            <a
              href={d.url}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-3 inline-flex min-h-[36px] items-center gap-1.5 truncate font-pn-mono text-[12px] text-pn-ink underline underline-offset-4"
            >
              {d.url.replace(/^https?:\/\//, '')}{' '}
              <ExternalLink size={12} aria-hidden />
            </a>

            <dl className="mt-4 grid grid-cols-4 gap-2 border-t border-pn-line pt-4">
              {[
                ['Enviada', d.sends],
                ['Leads', d.leads],
                ['Respondeu', d.responded],
                ['Fechou', d.won],
              ].map(([label, value]) => (
                <div key={label as string}>
                  <dt className="font-pn-mono text-[10px] uppercase tracking-[0.1em] text-pn-muted">
                    {label}
                  </dt>
                  <dd className="font-pn-display text-[28px] font-medium leading-none tracking-[-0.03em]">
                    {value}
                  </dd>
                </div>
              ))}
            </dl>
            <p className="mt-3 font-pn-mono text-[12px] text-pn-muted">
              {d.rate === null
                ? 'Ainda não foi enviada.'
                : `${Math.round(d.rate * 100)}% de resposta`}
            </p>
          </li>
        ))}

        <li>
          <button
            type="button"
            onClick={() => setDraft(EMPTY)}
            className="flex h-full min-h-[180px] w-full flex-col items-center justify-center gap-2 rounded-[3px] border border-dashed border-pn-ink/40 text-pn-ink transition-colors hover:bg-pn-sunk/60"
          >
            <Plus size={22} aria-hidden />
            <span className="font-pn-display text-[20px] italic">
              Cadastrar uma demo
            </span>
          </button>
        </li>
      </ul>

      {draft && (
        <form
          onSubmit={(e) => {
            e.preventDefault()
            save()
          }}
          className="mt-6 rounded-[3px] border border-pn-ink/30 bg-pn-card p-5"
          aria-label={draft.id ? 'Editar demo' : 'Nova demo'}
        >
          <h2 className="mb-4 font-pn-display text-[22px] font-medium tracking-[-0.02em]">
            {draft.id ? 'Editar demo' : 'Nova demo'}
          </h2>
          <div className="grid gap-3 sm:grid-cols-2">
            <Field label="Nome" htmlFor="dm-name">
              <input
                id="dm-name"
                value={draft.name}
                onChange={(e) =>
                  setDraft({
                    ...draft,
                    name: e.target.value,
                    slug: draft.id ? draft.slug : slugify(e.target.value),
                  })
                }
                className={inputCls}
              />
            </Field>
            <Field
              label="Código"
              htmlFor="dm-slug"
              hint="Identifica a demo nos envios. Não mude depois de usar."
            >
              <input
                id="dm-slug"
                value={draft.slug}
                onChange={(e) =>
                  setDraft({ ...draft, slug: slugify(e.target.value) })
                }
                disabled={!!draft.id}
                className={`${inputCls} font-pn-mono`}
              />
            </Field>
            <Field label="Endereço" htmlFor="dm-url">
              <input
                id="dm-url"
                type="url"
                value={draft.url}
                onChange={(e) => setDraft({ ...draft, url: e.target.value })}
                className={`${inputCls} font-pn-mono`}
              />
            </Field>
            <Field label="Nicho" htmlFor="dm-niche">
              <select
                id="dm-niche"
                value={draft.niche}
                onChange={(e) =>
                  setDraft({ ...draft, niche: e.target.value as NicheId | '' })
                }
                className={inputCls}
              >
                <option value="">Qualquer nicho</option>
                {NICHES.map((n) => (
                  <option key={n.id} value={n.id}>
                    {n.label}
                  </option>
                ))}
              </select>
            </Field>
            <Field
              label="Observação"
              htmlFor="dm-note"
              className="sm:col-span-2"
            >
              <input
                id="dm-note"
                value={draft.note}
                onChange={(e) => setDraft({ ...draft, note: e.target.value })}
                className={inputCls}
              />
            </Field>
          </div>
          <div className="mt-4 flex justify-end gap-2">
            <Btn variant="ghost" onClick={() => setDraft(null)}>
              Cancelar
            </Btn>
            <Btn
              type="submit"
              disabled={
                pending || draft.name.trim().length < 2 || draft.slug.length < 2
              }
            >
              Salvar demo
            </Btn>
          </div>
        </form>
      )}
    </div>
  )
}
