'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'
import toast from 'react-hot-toast'
import { Clock, MessageCircle, Send } from 'lucide-react'
import { setNextAction } from '@/app/admin/(painel)/leads/actions'
import { NICHE_LABEL, type StageId } from '@/lib/leads/constants'
import { addDaysISO, daysSince, relativeDay, todayISO } from '@/lib/leads/dates'
import { waLink } from '@/lib/leads/whatsapp'
import { cn } from '@/lib/utils'
import { buttonCls } from './ui'
import { useSendDemo, type SendableLead } from './send-demo'
import { Stamp, Tag } from './stamp'

export type CardLead = SendableLead & {
  nextActionAt: string | null
  nextActionNote: string | null
  lastContactAt: string | null
  stageChangedAt: string
}

const SNOOZE = [
  { label: 'Amanhã', days: 1 },
  { label: '+3 dias', days: 3 },
  { label: '+7 dias', days: 7 },
]

/**
 * Ficha da fila "Hoje". `tone` indica por que o lead está aqui:
 * atrasado (cor de sinal), hoje, esfriando ou sem primeiro contato.
 */
export function LeadCard({
  lead,
  tone = 'today',
  index = 0,
}: {
  lead: CardLead
  tone?: 'overdue' | 'today' | 'cooling' | 'fresh'
  index?: number
}) {
  const sendDemo = useSendDemo()
  const router = useRouter()
  const [pending, start] = useTransition()
  const today = todayISO()
  const idle = daysSince(lead.lastContactAt ?? lead.stageChangedAt)
  const wa = waLink(lead.phone)

  function snooze(days: number) {
    start(async () => {
      try {
        await setNextAction(
          lead.id,
          addDaysISO(today, days),
          lead.nextActionNote,
        )
        toast.success(`${lead.name}: adiado.`)
        router.refresh()
      } catch {
        toast.error('Não foi possível adiar.')
      }
    })
  }

  return (
    <article
      style={{ animationDelay: `${Math.min(index, 8) * 45}ms` }}
      className={cn(
        'pn-rise relative rounded-[3px] border bg-pn-card p-4 transition-shadow hover:shadow-[0_8px_24px_-16px_rgba(29,26,22,0.5)] sm:p-5',
        tone === 'overdue' ? 'border-pn-signal/50' : 'border-pn-line',
        pending && 'opacity-60',
      )}
    >
      {tone === 'overdue' && (
        <span
          aria-hidden
          className="absolute inset-y-0 left-0 w-[3px] bg-pn-signal"
        />
      )}

      <div className="flex flex-wrap items-start justify-between gap-x-4 gap-y-2">
        <div className="min-w-0">
          <Link
            href={`/admin/leads/${lead.id}`}
            className="block truncate font-pn-display text-[21px] font-medium leading-tight tracking-[-0.01em] text-pn-ink underline-offset-4 hover:underline"
          >
            {lead.name}
          </Link>
          <p className="mt-1 flex flex-wrap items-center gap-x-2 text-[13px] text-pn-muted">
            <span>{NICHE_LABEL[lead.niche]}</span>
            {lead.city && <span>· {lead.city}</span>}
            {lead.phone && (
              <span className="font-pn-mono text-[12px]">· {lead.phone}</span>
            )}
          </p>
        </div>
        <Stamp stage={lead.stage as StageId} />
      </div>

      <p className="mt-3 flex flex-wrap items-center gap-x-3 gap-y-1 text-[13px]">
        {lead.nextActionAt && (
          <Tag tone={tone === 'overdue' ? 'signal' : 'plain'}>
            <Clock size={12} className="mr-1.5" aria-hidden />
            {relativeDay(lead.nextActionAt, today)}
            {lead.nextActionNote ? `: ${lead.nextActionNote}` : ''}
          </Tag>
        )}
        {tone === 'cooling' && idle !== null && (
          <Tag tone="gold">{idle} dias sem contato</Tag>
        )}
        {tone === 'fresh' && <Tag>sem primeiro contato</Tag>}
      </p>

      <div className="mt-4 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() => sendDemo.open(lead)}
          className={buttonCls('ink', 'sm', 'flex-1 sm:flex-none')}
        >
          <Send size={15} aria-hidden /> Enviar demo
        </button>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonCls('outline', 'sm', 'flex-1 sm:flex-none')}
          >
            <MessageCircle size={15} aria-hidden /> WhatsApp
          </a>
        )}
        <div
          className="flex w-full items-center gap-1 sm:ml-auto sm:w-auto"
          role="group"
          aria-label="Adiar"
        >
          {SNOOZE.map((s) => (
            <button
              key={s.days}
              type="button"
              disabled={pending}
              onClick={() => snooze(s.days)}
              className="min-h-[36px] flex-1 rounded-[3px] px-2.5 font-pn-mono text-[11px] uppercase tracking-[0.06em] text-pn-muted transition-colors hover:bg-pn-sunk hover:text-pn-ink sm:flex-none"
            >
              {s.label}
            </button>
          ))}
        </div>
      </div>
    </article>
  )
}
