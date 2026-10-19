import { getDailyGoal, getMetrics } from '@/lib/db/queries/leads'
import { DailyBars, HBars } from '@/components/painel/charts'
import { Empty, PageHeader } from '@/components/painel/ui'
import {
  byNiche,
  bySource,
  dailyContacts,
  lostReasons,
  stageCounts,
  totals,
} from '@/lib/leads/stats'

export const dynamic = 'force-dynamic'
export const metadata = { title: 'Métricas' }

const pct = (n: number | null) => (n === null ? '–' : `${Math.round(n * 100)}%`)
const brl = (n: number) =>
  n.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
    maximumFractionDigits: 0,
  })

function Stat({
  label,
  value,
  sub,
}: {
  label: string
  value: string
  sub?: string
}) {
  return (
    <div className="rounded-[3px] border border-pn-line bg-pn-card p-4 sm:p-5">
      <p className="font-pn-mono text-[11px] uppercase tracking-[0.14em] text-pn-muted">
        {label}
      </p>
      <p className="mt-2 font-pn-display text-[38px] font-medium leading-none tracking-[-0.03em]">
        {value}
      </p>
      {sub && <p className="mt-2 text-[12.5px] text-pn-muted">{sub}</p>}
    </div>
  )
}

export default async function MetricasPage() {
  const [m, goal] = await Promise.all([getMetrics(), getDailyGoal()])
  const t = totals(m.all)

  if (t.total === 0) {
    return (
      <>
        <PageHeader eyebrow="Para decidir onde investir" title="Métricas" />
        <Empty title="Ainda não há o que medir.">
          Cadastre alguns leads e registre os contatos. Aqui você vai ver quais
          nichos e origens respondem mais.
        </Empty>
      </>
    )
  }

  const stages = stageCounts(m.all)
  const niche = byNiche(m.all)
  const source = bySource(m.all)
  const lost = lostReasons(m.all)
  const daily = dailyContacts(m.recent)

  return (
    <>
      <PageHeader eyebrow="Para decidir onde investir" title="Métricas" />

      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <Stat
          label="Leads"
          value={String(t.total)}
          sub={`${t.active} em andamento`}
        />
        <Stat
          label="Taxa de resposta"
          value={pct(t.rate)}
          sub={`${t.responded} de ${t.contacted} contatados`}
        />
        <Stat
          label="Fechados"
          value={String(t.won)}
          sub={
            t.wonValue > 0
              ? brl(t.wonValue)
              : `${t.lost} ${t.lost === 1 ? 'perdido' : 'perdidos'}`
          }
        />
        <Stat
          label="No funil"
          value={t.pipeline > 0 ? brl(t.pipeline) : '–'}
          sub="valor estimado dos ativos"
        />
      </div>

      <div className="mt-6 grid gap-6 lg:grid-cols-2">
        <DailyBars title="Contatos por dia" data={daily} goal={goal} />
        <HBars
          title="Onde estão os leads agora"
          rows={stages.map((s) => ({ label: s.label, value: s.value }))}
        />
        <HBars
          title="Resposta por nicho"
          rows={niche.map((r) => ({
            label: r.label,
            value: r.rate === null ? 0 : Math.round(r.rate * 100),
            note: `${r.responded}/${r.contacted}`,
          }))}
          unit="%"
          emptyText="Contate alguns leads para ver a resposta por nicho."
          tone="moss"
        />
        <HBars
          title="Resposta por origem"
          rows={source.map((r) => ({
            label: r.label,
            value: r.rate === null ? 0 : Math.round(r.rate * 100),
            note: `${r.responded}/${r.contacted}`,
          }))}
          unit="%"
          emptyText="Contate alguns leads para ver a resposta por origem."
          tone="moss"
        />
        {lost.length > 0 && <HBars title="Por que perdi" rows={lost} />}
      </div>
      <p className="mt-6 max-w-2xl text-[12.5px] leading-relaxed text-pn-muted">
        &quot;Respondeu&quot; conta quem chegou a Respondeu, Reunião, Proposta
        ou Fechado. Com poucos contatos por nicho, a porcentagem oscila muito:
        olhe também o 3/10, não só o 30%.
      </p>
    </>
  )
}
