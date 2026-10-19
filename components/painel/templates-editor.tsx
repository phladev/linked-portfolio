'use client'

import { useRouter } from 'next/navigation'
import { useRef, useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import { Plus, Trash2 } from 'lucide-react'
import {
  deleteTemplate,
  saveTemplate,
} from '@/app/admin/(painel)/leads/actions'
import { NICHES, NICHE_LABEL, type NicheId } from '@/lib/leads/constants'
import { fillTemplate } from '@/lib/leads/whatsapp'
import { cn } from '@/lib/utils'
import { Btn, Field, inputCls } from './ui'

export type TemplateRow = {
  id: string
  name: string
  niche: NicheId | null
  body: string
}

const VARS = ['{{nome}}', '{{cidade}}', '{{contato}}', '{{demo_url}}']

export function TemplatesEditor({ templates }: { templates: TemplateRow[] }) {
  const router = useRouter()
  const [selected, setSelected] = useState<string | 'new'>(
    templates[0]?.id ?? 'new',
  )
  const current = templates.find((t) => t.id === selected)
  const [name, setName] = useState(current?.name ?? '')
  const [niche, setNiche] = useState<NicheId | ''>(current?.niche ?? '')
  const [body, setBody] = useState(current?.body ?? '')
  const [pending, start] = useTransition()
  const bodyRef = useRef<HTMLTextAreaElement>(null)

  function pick(id: string | 'new') {
    setSelected(id)
    const t = templates.find((x) => x.id === id)
    setName(t?.name ?? '')
    setNiche(t?.niche ?? '')
    setBody(t?.body ?? '')
  }

  function insert(v: string) {
    const el = bodyRef.current
    if (!el) return setBody((b) => b + v)
    const { selectionStart: s, selectionEnd: e } = el
    const next = body.slice(0, s) + v + body.slice(e)
    setBody(next)
    requestAnimationFrame(() => {
      el.focus()
      el.setSelectionRange(s + v.length, s + v.length)
    })
  }

  function save() {
    start(async () => {
      try {
        await saveTemplate(selected === 'new' ? null : selected, {
          name,
          niche: niche || null,
          body,
        })
        toast.success('Modelo salvo.')
        router.refresh()
      } catch {
        toast.error('Preencha o nome e a mensagem.')
      }
    })
  }

  const preview = fillTemplate(body, {
    nome: 'Clínica Sorriso Vivo',
    cidade: 'Campinas',
    contato: 'Dra. Helena',
    demo_url: 'https://exemplo.vercel.app',
  })

  return (
    <div className="grid gap-6 lg:grid-cols-[260px_1fr]">
      <nav aria-label="Modelos">
        <ul className="space-y-1.5">
          {templates.map((t) => (
            <li key={t.id}>
              <button
                type="button"
                onClick={() => pick(t.id)}
                aria-current={selected === t.id ? 'true' : undefined}
                className={cn(
                  'w-full rounded-[3px] border px-3 py-2.5 text-left transition-colors',
                  selected === t.id
                    ? 'border-pn-ink bg-pn-ink text-pn-paper'
                    : 'border-pn-line bg-pn-card hover:border-pn-ink/50',
                )}
              >
                <span className="block text-[14px] font-medium">{t.name}</span>
                <span
                  className={cn(
                    'font-pn-mono text-[10.5px] uppercase tracking-[0.08em]',
                    selected === t.id ? 'text-pn-paper/70' : 'text-pn-muted',
                  )}
                >
                  {t.niche ? NICHE_LABEL[t.niche] : 'Qualquer nicho'}
                </span>
              </button>
            </li>
          ))}
          <li>
            <button
              type="button"
              onClick={() => pick('new')}
              className={cn(
                'flex min-h-[44px] w-full items-center justify-center gap-2 rounded-[3px] border border-dashed px-3 text-[14px]',
                selected === 'new'
                  ? 'border-pn-ink bg-pn-sunk'
                  : 'border-pn-ink/40 hover:bg-pn-sunk/60',
              )}
            >
              <Plus size={16} aria-hidden /> Novo modelo
            </button>
          </li>
        </ul>
      </nav>

      <div className="space-y-4">
        <div className="grid gap-3 sm:grid-cols-[1fr_200px]">
          <Field label="Nome do modelo" htmlFor="t-name">
            <input
              id="t-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputCls}
            />
          </Field>
          <Field label="Nicho" htmlFor="t-niche">
            <select
              id="t-niche"
              value={niche}
              onChange={(e) => setNiche(e.target.value as NicheId | '')}
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
        </div>

        <Field label="Mensagem" htmlFor="t-body">
          <textarea
            id="t-body"
            ref={bodyRef}
            value={body}
            onChange={(e) => setBody(e.target.value)}
            rows={9}
            className={`${inputCls} py-3 leading-relaxed`}
          />
        </Field>
        <div className="flex flex-wrap items-center gap-2">
          <span className="font-pn-mono text-[11px] uppercase tracking-[0.1em] text-pn-muted">
            Inserir
          </span>
          {VARS.map((v) => (
            <button
              key={v}
              type="button"
              onClick={() => insert(v)}
              className="min-h-[34px] rounded-[3px] border border-pn-line bg-pn-card px-2.5 font-pn-mono text-[12px] hover:border-pn-ink/50"
            >
              {v}
            </button>
          ))}
        </div>

        <div>
          <p className="mb-1.5 font-pn-mono text-[11px] uppercase tracking-[0.12em] text-pn-muted">
            Como chega no WhatsApp
          </p>
          <div className="whitespace-pre-wrap rounded-[3px] border border-pn-line bg-pn-sunk/60 p-4 text-[14px] leading-relaxed">
            {preview || (
              <span className="text-pn-muted">A prévia aparece aqui.</span>
            )}
          </div>
        </div>

        <div className="flex justify-between gap-2">
          {selected !== 'new' ? (
            <Btn
              variant="danger"
              disabled={pending}
              onClick={() => {
                if (!window.confirm('Excluir este modelo?')) return
                start(async () => {
                  await deleteTemplate(selected)
                  pick(templates.find((t) => t.id !== selected)?.id ?? 'new')
                  router.refresh()
                })
              }}
            >
              <Trash2 size={15} aria-hidden /> Excluir
            </Btn>
          ) : (
            <span />
          )}
          <Btn
            onClick={save}
            disabled={
              pending || name.trim().length < 2 || body.trim().length < 5
            }
          >
            Salvar modelo
          </Btn>
        </div>
      </div>
    </div>
  )
}
