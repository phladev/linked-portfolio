'use client'

import { useState } from 'react'
import { cn } from '@/lib/utils'

/**
 * Barras horizontais de uma série só: marca fina com a ponta arredondada,
 * valor escrito direto (sem legenda, o título nomeia a série) e tabela por baixo
 * do gráfico (<details>) para quem não enxerga cor ou prefere números.
 */
export function HBars({
  title,
  rows,
  unit = 'n',
  emptyText = 'Sem dados ainda.',
  tone = 'ink',
}: {
  title: string
  rows: { label: string; value: number; note?: string }[]
  unit?: 'n' | '%'
  emptyText?: string
  tone?: 'ink' | 'moss'
}) {
  const format = (n: number) => (unit === '%' ? `${n}%` : String(n))
  const max = Math.max(1, ...rows.map((r) => r.value))
  return (
    <figure className="rounded-[3px] border border-pn-line bg-pn-card p-4 sm:p-5">
      <figcaption className="mb-4 font-pn-display text-[20px] font-medium leading-none tracking-[-0.02em]">
        {title}
      </figcaption>
      {rows.length === 0 ? (
        <p className="text-[13px] text-pn-muted">{emptyText}</p>
      ) : (
        <>
          <ul className="space-y-3">
            {rows.map((r) => (
              <li
                key={r.label}
                title={`${r.label}: ${format(r.value)}${r.note ? ` (${r.note})` : ''}`}
              >
                <div className="mb-1 flex items-baseline justify-between gap-3 text-[13px]">
                  <span className="truncate text-pn-ink">{r.label}</span>
                  <span className="shrink-0 font-pn-mono text-[12px] text-pn-ink">
                    {format(r.value)}
                    {r.note && (
                      <span className="ml-2 text-pn-muted">{r.note}</span>
                    )}
                  </span>
                </div>
                <div className="h-2 rounded-r-[4px] bg-pn-line/60" aria-hidden>
                  <div
                    className={cn(
                      'h-2 rounded-r-[4px]',
                      tone === 'moss' ? 'bg-pn-moss' : 'bg-pn-ink',
                    )}
                    style={{
                      width: `${Math.max(r.value > 0 ? 2 : 0, (r.value / max) * 100)}%`,
                    }}
                  />
                </div>
              </li>
            ))}
          </ul>
          <details className="mt-4 text-[12px] text-pn-muted">
            <summary className="cursor-pointer select-none underline-offset-4 hover:underline">
              Ver como tabela
            </summary>
            <table className="mt-2 w-full text-left">
              <thead>
                <tr className="font-pn-mono text-[10.5px] uppercase tracking-[0.1em]">
                  <th className="py-1 font-medium">Item</th>
                  <th className="py-1 text-right font-medium">Valor</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-t border-pn-line">
                    <td className="py-1.5">{r.label}</td>
                    <td className="py-1.5 text-right font-pn-mono">
                      {format(r.value)}
                      {r.note ? ` · ${r.note}` : ''}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </details>
        </>
      )}
    </figure>
  )
}

/** Colunas por dia (14 dias). Hover/foco mostra o valor; só o pico e o último dia têm rótulo fixo. */
export function DailyBars({
  title,
  data,
  goal,
}: {
  title: string
  data: { date: string; value: number }[]
  goal?: number
}) {
  const [active, setActive] = useState<number | null>(null)
  const max = Math.max(1, goal ?? 0, ...data.map((d) => d.value))
  const peak = Math.max(...data.map((d) => d.value))
  const fmt = (iso: string) => {
    const [, m, d] = iso.split('-')
    return `${d}/${m}`
  }

  return (
    <figure className="rounded-[3px] border border-pn-line bg-pn-card p-4 sm:p-5">
      <figcaption className="mb-1 font-pn-display text-[20px] font-medium leading-none tracking-[-0.02em]">
        {title}
      </figcaption>
      <p
        className="mb-4 h-5 font-pn-mono text-[12px] text-pn-muted"
        aria-live="polite"
      >
        {active !== null
          ? `${fmt(data[active].date)}: ${data[active].value} contato(s)`
          : 'Passe o mouse ou o foco numa coluna'}
      </p>

      <div className="relative h-40">
        {[0, 0.5, 1].map((t) => (
          <div
            key={t}
            aria-hidden
            className="absolute inset-x-0 border-t border-pn-line/70"
            style={{ bottom: `${t * 100}%` }}
          />
        ))}
        {goal ? (
          <div
            aria-hidden
            className="absolute inset-x-0 border-t border-dashed border-pn-signal/60"
            style={{ bottom: `${(goal / max) * 100}%` }}
          />
        ) : null}
        <ul className="absolute inset-0 flex items-end gap-[6px]">
          {data.map((d, i) => {
            const h = (d.value / max) * 100
            const label =
              d.value === peak && peak > 0 ? true : i === data.length - 1
            return (
              <li
                key={d.date}
                className="relative flex h-full flex-1 items-end"
              >
                <button
                  type="button"
                  onMouseEnter={() => setActive(i)}
                  onMouseLeave={() => setActive(null)}
                  onFocus={() => setActive(i)}
                  onBlur={() => setActive(null)}
                  aria-label={`${fmt(d.date)}: ${d.value} contatos`}
                  className="group relative flex h-full w-full items-end outline-offset-2"
                >
                  <span
                    className={cn(
                      'w-full rounded-t-[4px] transition-colors',
                      active === i ? 'bg-pn-signal' : 'bg-pn-ink',
                    )}
                    style={{ height: d.value === 0 ? 2 : `${h}%` }}
                  />
                  {label && d.value > 0 && (
                    <span className="pointer-events-none absolute -top-5 left-1/2 -translate-x-1/2 font-pn-mono text-[11px] text-pn-ink">
                      {d.value}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      </div>
      <div className="mt-1.5 flex justify-between font-pn-mono text-[10.5px] text-pn-muted">
        <span>{fmt(data[0].date)}</span>
        {goal ? (
          <span className="text-pn-signal">- - meta {goal}/dia</span>
        ) : (
          <span />
        )}
        <span>{fmt(data[data.length - 1].date)}</span>
      </div>

      <details className="mt-3 text-[12px] text-pn-muted">
        <summary className="cursor-pointer select-none underline-offset-4 hover:underline">
          Ver como tabela
        </summary>
        <table className="mt-2 w-full text-left">
          <tbody>
            {data.map((d) => (
              <tr key={d.date} className="border-t border-pn-line">
                <td className="py-1.5 font-pn-mono">{fmt(d.date)}</td>
                <td className="py-1.5 text-right font-pn-mono">{d.value}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </details>
    </figure>
  )
}
