import { getToday } from '@/lib/db/queries/leads'
import { toCard } from '@/lib/leads/serialize'
import { GoalMeter } from '@/components/painel/goal-meter'
import { LeadCard } from '@/components/painel/lead-card'
import { OpenCapture } from '@/components/painel/open-capture'
import { Empty, PageHeader } from '@/components/painel/ui'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { relativeDay } from '@/lib/leads/dates'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Hoje' }

function Section({
  title,
  hint,
  count,
  tone = 'plain',
  children,
}: {
  title: string
  hint?: string
  count: number
  tone?: 'plain' | 'signal'
  children: React.ReactNode
}) {
  if (count === 0) return null
  return (
    <section className="mt-10" aria-labelledby={`s-${title}`}>
      <div className="mb-3 flex items-baseline gap-3">
        <h2
          id={`s-${title}`}
          className={cn(
            'font-pn-display text-[26px] font-medium leading-none tracking-[-0.02em]',
            tone === 'signal' && 'text-pn-signal',
          )}
        >
          {title}
        </h2>
        <span className="font-pn-mono text-[12px] text-pn-muted">{count}</span>
        {hint && (
          <span className="hidden text-[13px] text-pn-muted sm:inline">
            {hint}
          </span>
        )}
      </div>
      <div className="space-y-3">{children}</div>
    </section>
  )
}

export default async function HojePage() {
  const t = await getToday()
  const dateLabel = new Intl.DateTimeFormat('pt-BR', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
    timeZone: 'America/Sao_Paulo',
  }).format(new Date())

  const queue =
    t.overdue.length + t.dueToday.length + t.cooling.length + t.untouched.length

  return (
    <>
      <PageHeader eyebrow={dateLabel} title="Hoje" actions={<OpenCapture />} />

      <div className="grid gap-4 sm:grid-cols-[1.4fr_1fr]">
        <GoalMeter done={t.contactsToday} goal={t.goal} />
        <div className="grid grid-cols-2 gap-4">
          <div className="rounded-[3px] border border-pn-line bg-pn-card p-4 sm:p-5">
            <p className="font-pn-mono text-[11px] uppercase tracking-[0.14em] text-pn-muted">
              Em andamento
            </p>
            <p className="mt-2 font-pn-display text-[40px] font-medium leading-none tracking-[-0.03em]">
              {t.activeCount}
            </p>
          </div>
          <div className="rounded-[3px] border border-pn-line bg-pn-card p-4 sm:p-5">
            <p className="font-pn-mono text-[11px] uppercase tracking-[0.14em] text-pn-muted">
              Na fila
            </p>
            <p
              className={cn(
                'mt-2 font-pn-display text-[40px] font-medium leading-none tracking-[-0.03em]',
                t.overdue.length > 0 && 'text-pn-signal',
              )}
            >
              {queue}
            </p>
          </div>
        </div>
      </div>

      {t.totalLeads === 0 ? (
        <div className="mt-10">
          <Empty
            title="O caderno está em branco."
            action={
              <OpenCapture variant="ink">Cadastrar o primeiro lead</OpenCapture>
            }
          >
            Anote um negócio em 10 segundos (Ctrl K em qualquer tela) ou importe
            uma lista em CSV. Eles aparecem aqui, na fila do dia.
          </Empty>
          <p className="mt-4 text-center text-[13px] text-pn-muted">
            Já tem uma planilha?{' '}
            <Link
              href="/admin/leads/importar"
              className="font-semibold text-pn-ink underline underline-offset-4"
            >
              Importar CSV
            </Link>
          </p>
        </div>
      ) : queue === 0 ? (
        <div className="mt-10">
          <Empty title="Fila zerada.">
            Nenhum retorno vencido e nada esfriando. Que tal buscar mais
            negócios para a lista?
          </Empty>
        </div>
      ) : null}

      <Section
        title="Atrasados"
        tone="signal"
        count={t.overdue.length}
        hint="o retorno combinado já passou"
      >
        {t.overdue.map((l, i) => (
          <LeadCard key={l.id} lead={toCard(l)} tone="overdue" index={i} />
        ))}
      </Section>

      <Section title="Para hoje" count={t.dueToday.length}>
        {t.dueToday.map((l, i) => (
          <LeadCard key={l.id} lead={toCard(l)} tone="today" index={i} />
        ))}
      </Section>

      <Section
        title="Esfriando"
        count={t.cooling.length}
        hint="sem contato há 5 dias ou mais"
      >
        {t.cooling.map((l, i) => (
          <LeadCard key={l.id} lead={toCard(l)} tone="cooling" index={i} />
        ))}
      </Section>

      <Section
        title="Ainda sem contato"
        count={t.untouched.length}
        hint="cadastrados e sem data de retorno"
      >
        {t.untouched.slice(0, 12).map((l, i) => (
          <LeadCard key={l.id} lead={toCard(l)} tone="fresh" index={i} />
        ))}
      </Section>

      {t.upcoming.length > 0 && (
        <section className="mt-12" aria-labelledby="s-prox">
          <h2
            id="s-prox"
            className="mb-3 font-pn-display text-[26px] font-medium leading-none tracking-[-0.02em]"
          >
            Próximos 7 dias
          </h2>
          <ul className="divide-y divide-pn-line rounded-[3px] border border-pn-line bg-pn-card">
            {t.upcoming.map((l) => (
              <li key={l.id}>
                <Link
                  href={`/admin/leads/${l.id}`}
                  className="flex min-h-[52px] items-center justify-between gap-4 px-4 py-2 hover:bg-pn-sunk"
                >
                  <span className="truncate text-[15px] font-medium">
                    {l.name}
                  </span>
                  <span className="shrink-0 font-pn-mono text-[12px] text-pn-muted">
                    {relativeDay(l.nextActionAt!)}
                    {l.nextActionNote ? ` · ${l.nextActionNote}` : ''}
                  </span>
                </Link>
              </li>
            ))}
          </ul>
        </section>
      )}
    </>
  )
}
