'use client'

import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useState, useTransition } from 'react'
import toast from 'react-hot-toast'
import {
  ArrowRight,
  Globe,
  Instagram,
  Mail,
  MessageCircle,
  Phone,
  Send,
  StickyNote,
  Trash2,
  Users,
} from 'lucide-react'
import {
  addInteraction,
  deleteLead,
  moveLead,
  setNextAction,
  updateLead,
} from '@/app/admin/(painel)/leads/actions'
import {
  INTERACTION_LABEL,
  INTERACTION_TYPES,
  NICHES,
  NICHE_LABEL,
  SITE_QUALITIES,
  SOURCES,
  STAGES,
  type InteractionTypeId,
  type NicheId,
  type SiteQualityId,
  type SourceId,
  type StageId,
} from '@/lib/leads/constants'
import { addDaysISO, dateTime, relativeDay, todayISO } from '@/lib/leads/dates'
import { instagramUrl, waLink, websiteUrl } from '@/lib/leads/whatsapp'
import { cn } from '@/lib/utils'
import { LostDialog } from './lost-dialog'
import { useSendDemo } from './send-demo'
import { Stamp } from './stamp'
import { Btn, Field, buttonCls, inputCls } from './ui'

export type DetailLead = {
  id: string
  name: string
  niche: NicheId
  city: string | null
  contactName: string | null
  phone: string | null
  instagram: string | null
  website: string | null
  email: string | null
  source: SourceId
  stage: StageId
  siteQuality: SiteQualityId
  runsAds: boolean
  demoSlug: string | null
  nextActionAt: string | null
  nextActionNote: string | null
  valueEstimate: number | null
  lostReason: string | null
  notes: string | null
  lastContactAt: string | null
  stageChangedAt: string
  createdAt: string
}

export type DetailInteraction = {
  id: string
  type: InteractionTypeId
  content: string
  demoSlug: string | null
  createdAt: string
}

const ICON: Record<InteractionTypeId, typeof Phone> = {
  whatsapp: MessageCircle,
  ligacao: Phone,
  email: Mail,
  instagram: Instagram,
  reuniao: Users,
  nota: StickyNote,
  etapa: ArrowRight,
}

function Card({
  title,
  children,
  className,
}: {
  title: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <section
      className={cn(
        'rounded-[3px] border border-pn-line bg-pn-card p-4 sm:p-5',
        className,
      )}
    >
      <h2 className="mb-4 font-pn-display text-[22px] font-medium leading-none tracking-[-0.02em]">
        {title}
      </h2>
      {children}
    </section>
  )
}

export function LeadDetail({
  lead,
  interactions,
}: {
  lead: DetailLead
  interactions: DetailInteraction[]
}) {
  const router = useRouter()
  const sendDemo = useSendDemo()
  const [pending, start] = useTransition()
  const [lost, setLost] = useState(false)

  // dados editáveis
  const [f, setF] = useState({
    name: lead.name,
    niche: lead.niche,
    city: lead.city ?? '',
    contactName: lead.contactName ?? '',
    phone: lead.phone ?? '',
    instagram: lead.instagram ?? '',
    website: lead.website ?? '',
    email: lead.email ?? '',
    source: lead.source,
    siteQuality: lead.siteQuality,
    runsAds: lead.runsAds,
    valueEstimate: lead.valueEstimate ? String(lead.valueEstimate) : '',
    notes: lead.notes ?? '',
  })
  const set = <K extends keyof typeof f>(k: K, v: (typeof f)[K]) =>
    setF((s) => ({ ...s, [k]: v }))

  // próxima ação
  const [nextDate, setNextDate] = useState(lead.nextActionAt ?? '')
  const [nextNote, setNextNote] = useState(lead.nextActionNote ?? '')

  // registro rápido
  const [logType, setLogType] = useState<InteractionTypeId>('whatsapp')
  const [logText, setLogText] = useState('')

  const run = (fn: () => Promise<unknown>, ok: string) =>
    start(async () => {
      try {
        await fn()
        toast.success(ok)
        router.refresh()
      } catch {
        toast.error('Não foi possível salvar. Tente de novo.')
      }
    })

  const saveData = () => {
    if (f.name.trim().length < 2)
      return toast.error('Informe o nome do negócio.')
    run(
      () =>
        updateLead(lead.id, {
          name: f.name,
          niche: f.niche,
          city: f.city,
          contactName: f.contactName,
          phone: f.phone,
          instagram: f.instagram,
          website: f.website,
          email: f.email,
          source: f.source,
          siteQuality: f.siteQuality,
          runsAds: f.runsAds,
          valueEstimate: f.valueEstimate
            ? Number(f.valueEstimate.replace(/\D/g, ''))
            : null,
          notes: f.notes,
        }),
      'Dados salvos.',
    )
  }

  const changeStage = (stage: StageId) => {
    if (stage === lead.stage) return
    if (stage === 'perdido') return setLost(true)
    run(
      () => moveLead(lead.id, stage),
      `Movido para ${STAGES.find((s) => s.id === stage)?.label}.`,
    )
  }

  const wa = waLink(lead.phone)
  const ig = instagramUrl(lead.instagram)
  const site = websiteUrl(lead.website)
  const today = todayISO()

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={() =>
            sendDemo.open({
              id: lead.id,
              name: lead.name,
              niche: lead.niche,
              city: lead.city,
              contactName: lead.contactName,
              phone: lead.phone,
              stage: lead.stage,
              demoSlug: lead.demoSlug,
            })
          }
          className={buttonCls('ink')}
        >
          <Send size={16} aria-hidden /> Enviar demo
        </button>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonCls('outline')}
          >
            <MessageCircle size={16} aria-hidden /> WhatsApp
          </a>
        )}
        {lead.phone && (
          <a
            href={`tel:${lead.phone.replace(/[^\d+]/g, '')}`}
            className={buttonCls('outline')}
          >
            <Phone size={16} aria-hidden /> Ligar
          </a>
        )}
        {ig && (
          <a
            href={ig}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonCls('outline')}
          >
            <Instagram size={16} aria-hidden /> Instagram
          </a>
        )}
        {site && (
          <a
            href={site}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonCls('outline')}
          >
            <Globe size={16} aria-hidden /> Site
          </a>
        )}
      </div>

      <div className="grid gap-6 lg:grid-cols-[1.15fr_0.85fr]">
        <div className="space-y-6">
          <Card title="Próxima ação">
            <div className="grid gap-3 sm:grid-cols-[170px_1fr]">
              <Field label="Data" htmlFor="na-date">
                <input
                  id="na-date"
                  type="date"
                  value={nextDate}
                  onChange={(e) => setNextDate(e.target.value)}
                  className={cn(inputCls, 'font-pn-mono')}
                />
              </Field>
              <Field label="O que fazer" htmlFor="na-note">
                <input
                  id="na-note"
                  value={nextNote}
                  onChange={(e) => setNextNote(e.target.value)}
                  placeholder="Ex.: perguntar se viu a demo"
                  className={inputCls}
                />
              </Field>
            </div>
            <div className="mt-3 flex flex-wrap items-center gap-2">
              {[
                ['Hoje', 0],
                ['Amanhã', 1],
                ['+3 dias', 3],
                ['+7 dias', 7],
              ].map(([label, d]) => (
                <button
                  key={label}
                  type="button"
                  onClick={() => setNextDate(addDaysISO(today, d as number))}
                  className="min-h-[36px] rounded-[3px] border border-pn-line px-3 font-pn-mono text-[11px] uppercase tracking-[0.06em] text-pn-muted hover:border-pn-ink/50 hover:text-pn-ink"
                >
                  {label}
                </button>
              ))}
              <span className="ml-auto flex gap-2">
                {lead.nextActionAt && (
                  <Btn
                    size="sm"
                    variant="ghost"
                    disabled={pending}
                    onClick={() => {
                      setNextDate('')
                      setNextNote('')
                      run(
                        () => setNextAction(lead.id, null, null),
                        'Próxima ação removida.',
                      )
                    }}
                  >
                    Limpar
                  </Btn>
                )}
                <Btn
                  size="sm"
                  disabled={pending || !nextDate}
                  onClick={() =>
                    run(
                      () => setNextAction(lead.id, nextDate, nextNote),
                      'Próxima ação salva.',
                    )
                  }
                >
                  Salvar
                </Btn>
              </span>
            </div>
            {lead.nextActionAt && (
              <p className="mt-3 font-pn-mono text-[12px] text-pn-muted">
                Marcada para {relativeDay(lead.nextActionAt, today)}.
              </p>
            )}
          </Card>

          <Card title="Registrar contato">
            <div
              className="flex flex-wrap gap-2"
              role="radiogroup"
              aria-label="Tipo de registro"
            >
              {INTERACTION_TYPES.map((t) => (
                <label
                  key={t.id}
                  className={cn(
                    'inline-flex min-h-[36px] cursor-pointer items-center rounded-[3px] border px-3 text-[13px] has-[:focus-visible]:outline has-[:focus-visible]:outline-2 has-[:focus-visible]:outline-pn-ink',
                    logType === t.id
                      ? 'border-pn-ink bg-pn-ink text-pn-paper'
                      : 'border-pn-line hover:border-pn-ink/50',
                  )}
                >
                  <input
                    type="radio"
                    name="log-type"
                    className="sr-only"
                    checked={logType === t.id}
                    onChange={() => setLogType(t.id)}
                  />
                  {t.label}
                </label>
              ))}
            </div>
            <label htmlFor="log-text" className="sr-only">
              O que aconteceu
            </label>
            <textarea
              id="log-text"
              value={logText}
              onChange={(e) => setLogText(e.target.value)}
              rows={3}
              placeholder="O que foi dito, combinado ou respondido"
              className={`${inputCls} mt-3 py-3`}
            />
            <div className="mt-3 flex justify-end">
              <Btn
                disabled={pending}
                onClick={() =>
                  start(async () => {
                    try {
                      const { cleared } = await addInteraction(
                        lead.id,
                        logType as Exclude<InteractionTypeId, 'etapa'>,
                        logText,
                      )
                      setLogText('')
                      if (cleared) setNextDate('')
                      toast.success(
                        cleared
                          ? 'Registrado. A ação de hoje foi concluída: marque a próxima.'
                          : 'Registrado.',
                      )
                      router.refresh()
                    } catch {
                      toast.error('Não foi possível salvar. Tente de novo.')
                    }
                  })
                }
              >
                Registrar
              </Btn>
            </div>
          </Card>

          <Card title="Histórico">
            {interactions.length === 0 ? (
              <p className="text-[14px] text-pn-muted">
                Nada registrado ainda. Envie a demo ou anote o primeiro contato.
              </p>
            ) : (
              <ol className="relative space-y-5 border-l border-pn-line pl-5">
                {interactions.map((i) => {
                  const Icon = ICON[i.type]
                  return (
                    <li key={i.id} className="relative">
                      <span className="absolute -left-[31px] top-0.5 flex h-[22px] w-[22px] items-center justify-center rounded-full border border-pn-line bg-pn-card text-pn-muted">
                        <Icon size={12} aria-hidden />
                      </span>
                      <p className="flex flex-wrap items-center gap-x-2 font-pn-mono text-[11px] uppercase tracking-[0.08em] text-pn-muted">
                        <span className="font-semibold text-pn-ink">
                          {INTERACTION_LABEL[i.type]}
                        </span>
                        <span>{dateTime(i.createdAt)}</span>
                        {i.demoSlug && (
                          <span className="text-pn-gold">
                            demo: {i.demoSlug}
                          </span>
                        )}
                      </p>
                      {i.content && (
                        <p className="mt-1 whitespace-pre-wrap text-[14px] leading-relaxed">
                          {i.content}
                        </p>
                      )}
                    </li>
                  )
                })}
              </ol>
            )}
          </Card>
        </div>

        <div className="space-y-6">
          <Card title="Etapa">
            <div className="flex items-center justify-between gap-3">
              <Stamp stage={lead.stage} className="pn-stamp-in text-[12px]" />
              <label className="sr-only" htmlFor="stage-sel">
                Mover para
              </label>
              <select
                id="stage-sel"
                value={lead.stage}
                disabled={pending}
                onChange={(e) => changeStage(e.target.value as StageId)}
                className={cn(inputCls, 'max-w-[190px]')}
              >
                {STAGES.map((s) => (
                  <option key={s.id} value={s.id}>
                    {s.label}
                  </option>
                ))}
              </select>
            </div>
            {lead.stage === 'perdido' && lead.lostReason && (
              <p className="mt-3 text-[13px] text-pn-muted">
                Motivo: {lead.lostReason}
              </p>
            )}
            <p className="mt-3 font-pn-mono text-[11px] text-pn-muted">
              Criado em {dateTime(lead.createdAt)}
              {lead.lastContactAt
                ? ` · último contato ${dateTime(lead.lastContactAt)}`
                : ''}
            </p>
          </Card>

          <Card title="Dados">
            <div className="space-y-3">
              <Field label="Negócio" htmlFor="d-name">
                <input
                  id="d-name"
                  value={f.name}
                  onChange={(e) => set('name', e.target.value)}
                  className={inputCls}
                />
              </Field>
              <div className="grid gap-3 sm:grid-cols-2">
                <Field label="Nicho" htmlFor="d-niche">
                  <select
                    id="d-niche"
                    value={f.niche}
                    onChange={(e) => set('niche', e.target.value as NicheId)}
                    className={inputCls}
                  >
                    {NICHES.map((n) => (
                      <option key={n.id} value={n.id}>
                        {NICHE_LABEL[n.id]}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Cidade" htmlFor="d-city">
                  <input
                    id="d-city"
                    value={f.city}
                    onChange={(e) => set('city', e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Contato" htmlFor="d-contact">
                  <input
                    id="d-contact"
                    value={f.contactName}
                    onChange={(e) => set('contactName', e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="WhatsApp" htmlFor="d-phone">
                  <input
                    id="d-phone"
                    value={f.phone}
                    onChange={(e) => set('phone', e.target.value)}
                    inputMode="tel"
                    className={cn(inputCls, 'font-pn-mono')}
                  />
                </Field>
                <Field label="Instagram" htmlFor="d-ig">
                  <input
                    id="d-ig"
                    value={f.instagram}
                    onChange={(e) => set('instagram', e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field label="Site" htmlFor="d-site">
                  <input
                    id="d-site"
                    value={f.website}
                    onChange={(e) => set('website', e.target.value)}
                    className={inputCls}
                  />
                </Field>
                <Field
                  label="E-mail"
                  htmlFor="d-mail"
                  className="sm:col-span-2"
                >
                  <input
                    id="d-mail"
                    type="email"
                    value={f.email}
                    onChange={(e) => set('email', e.target.value)}
                    className={inputCls}
                  />
                </Field>
              </div>

              <div className="grid gap-3 border-t border-pn-line pt-4 sm:grid-cols-2">
                <Field label="Onde achei" htmlFor="d-source">
                  <select
                    id="d-source"
                    value={f.source}
                    onChange={(e) => set('source', e.target.value as SourceId)}
                    className={inputCls}
                  >
                    {SOURCES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Site atual" htmlFor="d-quality">
                  <select
                    id="d-quality"
                    value={f.siteQuality}
                    onChange={(e) =>
                      set('siteQuality', e.target.value as SiteQualityId)
                    }
                    className={inputCls}
                  >
                    {SITE_QUALITIES.map((s) => (
                      <option key={s.id} value={s.id}>
                        {s.label}
                      </option>
                    ))}
                  </select>
                </Field>
                <Field label="Valor estimado (R$)" htmlFor="d-value">
                  <input
                    id="d-value"
                    value={f.valueEstimate}
                    onChange={(e) => set('valueEstimate', e.target.value)}
                    inputMode="numeric"
                    className={cn(inputCls, 'font-pn-mono')}
                  />
                </Field>
                <label className="flex min-h-[44px] cursor-pointer items-center gap-3 self-end text-[14px]">
                  <input
                    type="checkbox"
                    checked={f.runsAds}
                    onChange={(e) => set('runsAds', e.target.checked)}
                    className="h-5 w-5 accent-[rgb(var(--pn-ink))]"
                  />
                  Anuncia (tem verba)
                </label>
              </div>

              <Field label="Anotações" htmlFor="d-notes">
                <textarea
                  id="d-notes"
                  value={f.notes}
                  onChange={(e) => set('notes', e.target.value)}
                  rows={4}
                  className={`${inputCls} py-3`}
                />
              </Field>
              <div className="flex justify-end">
                <Btn onClick={saveData} disabled={pending}>
                  Salvar dados
                </Btn>
              </div>
            </div>
          </Card>

          <div className="flex items-center justify-between rounded-[3px] border border-dashed border-pn-line px-4 py-3">
            <Link
              href="/admin/leads"
              className="text-[13px] text-pn-muted underline underline-offset-4 hover:text-pn-ink"
            >
              Voltar para a lista
            </Link>
            <Btn
              size="sm"
              variant="danger"
              disabled={pending}
              onClick={() => {
                if (
                  !window.confirm(
                    `Excluir "${lead.name}" e todo o histórico? Isso não pode ser desfeito.`,
                  )
                )
                  return
                start(async () => {
                  await deleteLead(lead.id)
                  toast.success('Lead excluído.')
                  router.push('/admin/leads')
                })
              }}
            >
              <Trash2 size={14} aria-hidden /> Excluir
            </Btn>
          </div>
        </div>
      </div>

      {lost && (
        <LostDialog
          name={lead.name}
          onCancel={() => setLost(false)}
          onConfirm={(reason) => {
            setLost(false)
            run(
              () => moveLead(lead.id, 'perdido', reason),
              'Marcado como perdido.',
            )
          }}
        />
      )}
    </div>
  )
}
