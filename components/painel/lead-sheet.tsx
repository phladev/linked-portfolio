'use client'

import Link from 'next/link'
import { useEffect, useRef } from 'react'
import {
  ChevronLeft,
  ChevronRight,
  ExternalLink,
  Globe,
  Instagram,
  Mail,
  MessageCircle,
  Pencil,
  Phone,
  X,
} from 'lucide-react'
import {
  NICHE_LABEL,
  SITE_QUALITY_LABEL,
  SOURCE_LABEL,
  type SiteQualityId,
} from '@/lib/leads/constants'
import { daysSince, relativeDay, todayISO } from '@/lib/leads/dates'
import { instagramUrl, waLink, websiteUrl } from '@/lib/leads/whatsapp'
import { buttonCls } from './ui'
import { Stamp, Tag } from './stamp'
import type { TableLead } from './leads-table'

type Props = {
  lead: TableLead | null
  position: { index: number; total: number }
  onClose: () => void
  onStep: (dir: -1 | 1) => void
}

/** Painel lateral com o essencial do lead; a edição completa fica na página dele. */
export function LeadSheet({ lead, position, onClose, onStep }: Props) {
  const ref = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const dlg = ref.current
    if (!dlg) return
    if (lead && !dlg.open) dlg.showModal()
    if (!lead && dlg.open) dlg.close()
  }, [lead])

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => e.target === ref.current && onClose()}
      onKeyDown={(e) => {
        if (e.key === 'ArrowDown' || e.key === 'j') onStep(1)
        if (e.key === 'ArrowUp' || e.key === 'k') onStep(-1)
      }}
      aria-label="Detalhes do lead"
      className="pn-sheet m-0 ml-auto h-dvh max-h-none w-full max-w-[440px] border-l border-pn-ink/20 bg-pn-card p-0 text-pn-ink shadow-[-24px_0_60px_-24px_rgba(29,26,22,0.45)] backdrop:bg-pn-ink/45 backdrop:backdrop-blur-[2px]"
    >
      {lead && <SheetBody key={lead.id} lead={lead} />}
      <div className="absolute inset-x-0 top-0 flex items-center justify-between border-b border-pn-line bg-pn-card px-3 py-2">
        <div className="flex items-center gap-1">
          <StepBtn
            label="Lead anterior"
            disabled={position.index <= 0}
            onClick={() => onStep(-1)}
          >
            <ChevronLeft size={18} />
          </StepBtn>
          <StepBtn
            label="Próximo lead"
            disabled={position.index >= position.total - 1}
            onClick={() => onStep(1)}
          >
            <ChevronRight size={18} />
          </StepBtn>
          <span className="ml-1 font-pn-mono text-[11px] text-pn-muted">
            {position.index + 1} / {position.total}
          </span>
        </div>
        <button
          type="button"
          onClick={onClose}
          aria-label="Fechar"
          className="flex h-10 w-10 items-center justify-center rounded-[3px] text-pn-muted hover:bg-pn-sunk hover:text-pn-ink"
        >
          <X size={18} />
        </button>
      </div>
    </dialog>
  )
}

function StepBtn({
  label,
  disabled,
  onClick,
  children,
}: {
  label: string
  disabled: boolean
  onClick: () => void
  children: React.ReactNode
}) {
  return (
    <button
      type="button"
      aria-label={label}
      disabled={disabled}
      onClick={onClick}
      className="flex h-10 w-10 items-center justify-center rounded-[3px] text-pn-ink hover:bg-pn-sunk disabled:pointer-events-none disabled:opacity-30"
    >
      {children}
    </button>
  )
}

function SheetBody({ lead }: { lead: TableLead }) {
  const today = todayISO()
  const wa = waLink(lead.phone)
  const insta = instagramUrl(lead.instagram)
  const site = websiteUrl(lead.website)
  const idle = daysSince(lead.lastContactAt)
  const quality = lead.siteQuality as SiteQualityId

  return (
    <div className="flex h-full flex-col">
      <div className="pn-scroll flex-1 overflow-y-auto px-5 pb-5 pt-[68px]">
        <Stamp stage={lead.stage} />
        <h2 className="mt-3 font-pn-display text-[30px] font-medium leading-[1.05] tracking-[-0.02em]">
          {lead.name}
        </h2>
        <p className="mt-1.5 text-[13px] text-pn-muted">
          {NICHE_LABEL[lead.niche]} · {lead.city ?? 'sem cidade'} ·{' '}
          {SOURCE_LABEL[lead.source]}
        </p>
        {lead.contactName && (
          <p className="mt-1 text-[13px] text-pn-ink/80">
            Contato: {lead.contactName}
          </p>
        )}

        <Section title="Contato">
          <Row icon={<Phone size={15} />} empty="sem telefone">
            {lead.phone && (
              <a href={`tel:${lead.phone}`} className="hover:underline">
                {lead.phone}
              </a>
            )}
          </Row>
          <Row icon={<Instagram size={15} />} empty="sem Instagram">
            {insta && <ExtLink href={insta}>{lead.instagram}</ExtLink>}
          </Row>
          <Row icon={<Globe size={15} />} empty="sem site">
            {site && <ExtLink href={site}>{lead.website}</ExtLink>}
          </Row>
          <Row icon={<Mail size={15} />} empty="sem e-mail">
            {lead.email && (
              <a href={`mailto:${lead.email}`} className="hover:underline">
                {lead.email}
              </a>
            )}
          </Row>
        </Section>

        <Section title="Situação">
          <dl className="grid grid-cols-2 gap-x-4 gap-y-3 text-[14px]">
            <Item label="Site">{SITE_QUALITY_LABEL[quality]}</Item>
            <Item label="Último contato">
              {idle === null
                ? 'nunca'
                : idle === 0
                  ? 'hoje'
                  : `há ${idle} dia(s)`}
            </Item>
            <Item label="Próxima ação" wide>
              {lead.nextActionAt ? (
                <>
                  <Tag
                    tone={lead.nextActionAt < today ? 'signal' : 'plain'}
                    className="!text-[12px]"
                  >
                    {relativeDay(lead.nextActionAt, today)}
                  </Tag>
                  {lead.nextActionNote ? ` · ${lead.nextActionNote}` : ''}
                </>
              ) : (
                <span className="text-pn-muted">sem data</span>
              )}
            </Item>
            {lead.valueEstimate !== null && (
              <Item label="Valor estimado">
                {lead.valueEstimate.toLocaleString('pt-BR', {
                  style: 'currency',
                  currency: 'BRL',
                  maximumFractionDigits: 0,
                })}
              </Item>
            )}
          </dl>
        </Section>

        {lead.notes && (
          <Section title="Notas">
            <p className="whitespace-pre-wrap text-[14px] leading-relaxed text-pn-ink/85">
              {lead.notes}
            </p>
          </Section>
        )}
      </div>

      <div className="flex gap-2 border-t border-pn-line bg-pn-card px-5 py-3">
        <Link
          href={`/admin/leads/${lead.id}`}
          className={buttonCls('ink', 'md', 'flex-1')}
        >
          <Pencil size={16} aria-hidden /> Editar
        </Link>
        {wa && (
          <a
            href={wa}
            target="_blank"
            rel="noopener noreferrer"
            className={buttonCls('outline', 'md', 'flex-1')}
          >
            <MessageCircle size={16} aria-hidden /> WhatsApp
          </a>
        )}
      </div>
    </div>
  )
}

function Section({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  return (
    <section className="mt-6">
      <h3 className="mb-2.5 font-pn-mono text-[11px] uppercase tracking-[0.12em] text-pn-muted">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  )
}

function Row({
  icon,
  empty,
  children,
}: {
  icon: React.ReactNode
  empty: string
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-[28px] items-center gap-2.5 text-[14px]">
      <span aria-hidden className="text-pn-muted">
        {icon}
      </span>
      <span className="min-w-0 truncate">
        {children || <span className="text-pn-muted/70">{empty}</span>}
      </span>
    </div>
  )
}

function Item({
  label,
  wide,
  children,
}: {
  label: string
  wide?: boolean
  children: React.ReactNode
}) {
  return (
    <div className={wide ? 'col-span-2' : undefined}>
      <dt className="text-[12px] text-pn-muted">{label}</dt>
      <dd className="mt-0.5">{children}</dd>
    </div>
  )
}

function ExtLink({
  href,
  children,
}: {
  href: string
  children: React.ReactNode
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className="inline-flex max-w-full items-center gap-1 hover:underline"
    >
      <span className="truncate">{children}</span>
      <ExternalLink size={12} aria-hidden className="shrink-0 text-pn-muted" />
    </a>
  )
}
