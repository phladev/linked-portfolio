'use client'

import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  useTransition,
} from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Copy, MessageCircle, X } from 'lucide-react'
import { logDemoSent } from '@/app/admin/(painel)/leads/actions'
import type { Demo, Template } from '@/lib/db/queries/leads'
import { NICHE_LABEL, type NicheId, type StageId } from '@/lib/leads/constants'
import { fillTemplate, normalizePhone, waLink } from '@/lib/leads/whatsapp'
import { Btn, Field, inputCls } from './ui'

export type SendableLead = {
  id: string
  name: string
  niche: NicheId
  city: string | null
  contactName: string | null
  phone: string | null
  stage: StageId
  demoSlug: string | null
}

type Ctx = { open: (lead: SendableLead) => void }
const SendDemoCtx = createContext<Ctx>({ open: () => {} })
export const useSendDemo = () => useContext(SendDemoCtx)

const isFollowUp = (t: Template) => /follow/i.test(t.name)

function pickDemo(lead: SendableLead, demos: Demo[]) {
  return (
    demos.find((d) => d.slug === lead.demoSlug) ??
    demos.find((d) => d.niche === lead.niche) ??
    demos[0]
  )
}

function pickTemplate(lead: SendableLead, templates: Template[]) {
  const followUp =
    lead.demoSlug && lead.stage !== 'novo' && lead.stage !== 'contatado'
  if (followUp) {
    const f = templates.find(isFollowUp)
    if (f) return f
  }
  const first = templates.filter((t) => !isFollowUp(t))
  return (
    first.find((t) => t.niche === lead.niche) ??
    first.find((t) => !t.niche) ??
    templates[0]
  )
}

export function SendDemoProvider({
  demos,
  templates,
  children,
}: {
  demos: Demo[]
  templates: Template[]
  children: React.ReactNode
}) {
  const [lead, setLead] = useState<SendableLead | null>(null)
  const ctx = useMemo(() => ({ open: setLead }), [])
  return (
    <SendDemoCtx.Provider value={ctx}>
      {children}
      {lead && (
        <SendDemoDialog
          key={lead.id}
          lead={lead}
          demos={demos}
          templates={templates}
          onClose={() => setLead(null)}
        />
      )}
    </SendDemoCtx.Provider>
  )
}

function SendDemoDialog({
  lead,
  demos,
  templates,
  onClose,
}: {
  lead: SendableLead
  demos: Demo[]
  templates: Template[]
  onClose: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const router = useRouter()
  const [pending, start] = useTransition()
  const [demoSlug, setDemoSlug] = useState(pickDemo(lead, demos)?.slug ?? '')
  const [templateId, setTemplateId] = useState(
    pickTemplate(lead, templates)?.id ?? '',
  )
  const demo = demos.find((d) => d.slug === demoSlug)
  const template = templates.find((t) => t.id === templateId)

  const generated = useMemo(
    () =>
      template
        ? fillTemplate(template.body, {
            nome: lead.name,
            cidade: lead.city,
            contato: lead.contactName,
            demo_url: demo?.url ?? '',
          })
        : '',
    [template, lead, demo],
  )
  const [text, setText] = useState(generated)
  const [edited, setEdited] = useState(false)

  useEffect(() => {
    if (!edited) setText(generated)
  }, [generated, edited])

  useEffect(() => {
    ref.current?.showModal()
  }, [])

  const phoneOk = !!normalizePhone(lead.phone)
  const link = waLink(lead.phone, text)

  function sendAndLog() {
    if (!link || !demo) return
    window.open(link, '_blank', 'noopener,noreferrer')
    start(async () => {
      try {
        await logDemoSent(lead.id, demo.slug, text)
        toast.success('Demo registrada. Follow-up marcado para daqui 3 dias.')
        router.refresh()
        onClose()
      } catch {
        toast.error(
          'Abri o WhatsApp, mas não consegui registrar. Anote na ficha.',
        )
      }
    })
  }

  async function copy() {
    try {
      await navigator.clipboard.writeText(text)
      toast.success('Mensagem copiada.')
    } catch {
      toast.error('Não foi possível copiar.')
    }
  }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      className="m-auto max-h-[92dvh] w-[calc(100%-24px)] max-w-xl overflow-y-auto rounded-[3px] border border-pn-ink/20 bg-pn-card p-0 text-pn-ink shadow-[0_24px_60px_-20px_rgba(29,26,22,0.45)] backdrop:bg-pn-ink/45 backdrop:backdrop-blur-[2px]"
    >
      <div className="flex items-start justify-between gap-4 border-b border-pn-line px-5 py-4">
        <div className="min-w-0">
          <h2 className="font-pn-display text-[26px] font-medium leading-none tracking-[-0.02em]">
            Enviar demo
          </h2>
          <p className="mt-1.5 truncate text-[13px] text-pn-muted">
            {lead.name} · {NICHE_LABEL[lead.niche]}
            {lead.city ? ` · ${lead.city}` : ''}
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
        {!phoneOk && (
          <p className="rounded-[3px] border border-pn-signal/40 bg-pn-signal/5 px-3 py-2 text-[13px] text-pn-signal">
            Este lead não tem um WhatsApp válido. Você pode copiar a mensagem,
            mas não abrir a conversa.
          </p>
        )}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Demo" htmlFor="sd-demo">
            <select
              id="sd-demo"
              value={demoSlug}
              onChange={(e) => setDemoSlug(e.target.value)}
              className={inputCls}
            >
              {demos.map((d) => (
                <option key={d.slug} value={d.slug}>
                  {d.name}
                </option>
              ))}
            </select>
          </Field>
          <Field label="Modelo" htmlFor="sd-tpl">
            <select
              id="sd-tpl"
              value={templateId}
              onChange={(e) => {
                setEdited(false)
                setTemplateId(e.target.value)
              }}
              className={inputCls}
            >
              {templates.map((t) => (
                <option key={t.id} value={t.id}>
                  {t.name}
                </option>
              ))}
            </select>
          </Field>
        </div>

        <Field
          label="Mensagem"
          htmlFor="sd-text"
          hint="Você pode ajustar o texto antes de enviar."
        >
          <textarea
            id="sd-text"
            value={text}
            onChange={(e) => {
              setEdited(true)
              setText(e.target.value)
            }}
            rows={9}
            className={`${inputCls} py-3 leading-relaxed`}
          />
        </Field>
      </div>

      <div className="flex flex-wrap justify-end gap-2 border-t border-pn-line px-5 py-4">
        <Btn variant="outline" onClick={copy}>
          <Copy size={16} aria-hidden /> Copiar
        </Btn>
        <Btn
          variant="ink"
          onClick={sendAndLog}
          disabled={!phoneOk || !demo || pending}
        >
          <MessageCircle size={16} aria-hidden /> Abrir WhatsApp e registrar
        </Btn>
      </div>
    </dialog>
  )
}
