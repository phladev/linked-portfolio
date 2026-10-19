'use client'

import { useEffect, useRef, useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { X } from 'lucide-react'
import { createLead } from '@/app/admin/(painel)/leads/actions'
import {
  NICHES,
  SOURCES,
  type NicheId,
  type SourceId,
} from '@/lib/leads/constants'
import { todayISO } from '@/lib/leads/dates'
import { cn } from '@/lib/utils'
import { Btn, Field, inputCls } from './ui'

type Draft = {
  name: string
  niche: NicheId
  city: string
  phone: string
  link: string
  source: SourceId
  scheduleToday: boolean
}

const EMPTY: Draft = {
  name: '',
  niche: 'advocacia',
  city: '',
  phone: '',
  link: '',
  source: 'maps',
  scheduleToday: true,
}

/** "@usuario" ou instagram.com/... vira Instagram; qualquer outra coisa vira site. */
function splitLink(value: string) {
  const v = value.trim()
  if (!v) return { instagram: null, website: null }
  if (v.startsWith('@') || /instagram\.com/i.test(v))
    return { instagram: v, website: null }
  return { instagram: null, website: v }
}

export function CaptureDialog({
  open,
  onClose,
}: {
  open: boolean
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const nameRef = useRef<HTMLInputElement>(null)
  const router = useRouter()
  const [draft, setDraft] = useState<Draft>(EMPTY)
  const [error, setError] = useState('')
  const [pending, start] = useTransition()

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (open && !dlg.open) {
      dlg.showModal()
      setTimeout(() => nameRef.current?.focus(), 30)
    }
    if (!open && dlg.open) dlg.close()
  }, [open])

  function save(another: boolean) {
    if (draft.name.trim().length < 2) {
      setError('Informe o nome do negócio.')
      nameRef.current?.focus()
      return
    }
    setError('')
    start(async () => {
      try {
        const { instagram, website } = splitLink(draft.link)
        await createLead({
          name: draft.name,
          niche: draft.niche,
          city: draft.city,
          phone: draft.phone,
          instagram,
          website,
          source: draft.source,
          siteQuality: website ? 'desconhecido' : 'nenhum',
          nextActionAt: draft.scheduleToday ? todayISO() : null,
          nextActionNote: draft.scheduleToday ? 'Primeiro contato' : null,
        })
        toast.success(`${draft.name.trim()} salvo.`)
        router.refresh()
        if (another) {
          setDraft((d) => ({
            ...EMPTY,
            niche: d.niche,
            city: d.city,
            source: d.source,
            scheduleToday: d.scheduleToday,
          }))
          nameRef.current?.focus()
        } else {
          setDraft(EMPTY)
          onClose()
        }
      } catch {
        setError('Não foi possível salvar. Tente de novo.')
      }
    })
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onCancel={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto w-[calc(100%-24px)] max-w-lg rounded-[3px] border border-pn-ink/20 bg-pn-card p-0 text-pn-ink shadow-[0_24px_60px_-20px_rgba(29,26,22,0.45)] backdrop:bg-pn-ink/45 backdrop:backdrop-blur-[2px]"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          save(false)
        }}
      >
        <div className="flex items-start justify-between gap-4 border-b border-pn-line px-5 py-4">
          <div>
            <h2 className="font-pn-display text-[26px] font-medium leading-none tracking-[-0.02em]">
              Novo lead
            </h2>
            <p className="mt-1.5 text-[13px] text-pn-muted">
              Só o nome é obrigatório. O resto você completa depois.
            </p>
          </div>
          <button
            type="button"
            onClick={onClose}
            aria-label="Fechar"
            className="-mr-2 flex h-10 w-10 items-center justify-center rounded-[3px] text-pn-muted hover:bg-pn-sunk hover:text-pn-ink"
          >
            <X size={18} />
          </button>
        </div>

        <div className="space-y-4 px-5 py-5">
          <Field label="Negócio" htmlFor="cap-name">
            <input
              id="cap-name"
              ref={nameRef}
              value={draft.name}
              onChange={(e) => setDraft({ ...draft, name: e.target.value })}
              className={inputCls}
              placeholder="Ex.: Clínica Sorriso Vivo"
              autoComplete="off"
              aria-invalid={!!error}
            />
            {error && (
              <p
                role="alert"
                className="mt-1.5 text-[13px] font-semibold text-pn-signal"
              >
                {error}
              </p>
            )}
          </Field>

          <fieldset>
            <legend className="mb-1.5 font-pn-mono text-[11px] uppercase tracking-[0.12em] text-pn-muted">
              Nicho
            </legend>
            <div className="flex flex-wrap gap-2">
              {NICHES.map((n) => (
                <label
                  key={n.id}
                  className={cn(
                    'inline-flex min-h-[38px] cursor-pointer items-center rounded-[3px] border px-3 text-[13px] font-medium transition-colors has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pn-ink',
                    draft.niche === n.id
                      ? 'border-pn-ink bg-pn-ink text-pn-paper'
                      : 'border-pn-line bg-pn-card text-pn-ink hover:border-pn-ink/50',
                  )}
                >
                  <input
                    type="radio"
                    name="niche"
                    value={n.id}
                    checked={draft.niche === n.id}
                    onChange={() => setDraft({ ...draft, niche: n.id })}
                    className="sr-only"
                  />
                  {n.label}
                </label>
              ))}
            </div>
          </fieldset>

          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Cidade" htmlFor="cap-city">
              <input
                id="cap-city"
                value={draft.city}
                onChange={(e) => setDraft({ ...draft, city: e.target.value })}
                className={inputCls}
                autoComplete="off"
              />
            </Field>
            <Field label="WhatsApp" htmlFor="cap-phone">
              <input
                id="cap-phone"
                value={draft.phone}
                onChange={(e) => setDraft({ ...draft, phone: e.target.value })}
                className={cn(inputCls, 'font-pn-mono')}
                inputMode="tel"
                placeholder="(11) 90000-0000"
                autoComplete="off"
              />
            </Field>
            <Field label="Instagram ou site" htmlFor="cap-link">
              <input
                id="cap-link"
                value={draft.link}
                onChange={(e) => setDraft({ ...draft, link: e.target.value })}
                className={inputCls}
                placeholder="@perfil ou site.com.br"
                autoComplete="off"
              />
            </Field>
            <Field label="Onde achei" htmlFor="cap-source">
              <select
                id="cap-source"
                value={draft.source}
                onChange={(e) =>
                  setDraft({ ...draft, source: e.target.value as SourceId })
                }
                className={inputCls}
              >
                {SOURCES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </Field>
          </div>

          <label className="flex min-h-[44px] cursor-pointer items-center gap-3 text-[14px]">
            <input
              type="checkbox"
              checked={draft.scheduleToday}
              onChange={(e) =>
                setDraft({ ...draft, scheduleToday: e.target.checked })
              }
              className="h-5 w-5 accent-[rgb(var(--pn-ink))]"
            />
            Agendar o primeiro contato para hoje
          </label>
        </div>

        <div className="flex flex-wrap justify-end gap-2 border-t border-pn-line px-5 py-4">
          <Btn variant="outline" onClick={() => save(true)} disabled={pending}>
            Salvar e adicionar outro
          </Btn>
          <Btn type="submit" variant="ink" disabled={pending}>
            {pending ? 'Salvando…' : 'Salvar'}
          </Btn>
        </div>
      </form>
    </dialog>
  )
}
