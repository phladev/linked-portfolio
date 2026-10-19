'use client'

import { useState, useTransition } from 'react'
import { useRouter } from 'next/navigation'
import toast from 'react-hot-toast'
import { Pencil } from 'lucide-react'
import { setDailyGoal } from '@/app/admin/(painel)/leads/actions'
import { cn } from '@/lib/utils'

/** Régua de contatos do dia: um tique por contato feito, como marcações num caderno. */
export function GoalMeter({ done, goal }: { done: number; goal: number }) {
  const router = useRouter()
  const [editing, setEditing] = useState(false)
  const [value, setValue] = useState(String(goal))
  const [pending, start] = useTransition()
  const ticks = Math.min(goal, 40)
  const filled = Math.min(done, ticks)
  const reached = done >= goal

  function save(e: React.FormEvent) {
    e.preventDefault()
    const n = Number(value)
    if (!Number.isInteger(n) || n < 1 || n > 200) {
      toast.error('Use um número de 1 a 200.')
      return
    }
    start(async () => {
      await setDailyGoal(n)
      setEditing(false)
      router.refresh()
    })
  }

  return (
    <div className="rounded-[3px] border border-pn-line bg-pn-card p-4 sm:p-5">
      <div className="flex flex-wrap items-baseline justify-between gap-2">
        <p className="font-pn-mono text-[11px] uppercase tracking-[0.14em] text-pn-muted">
          Contatos de hoje
        </p>
        {editing ? (
          <form onSubmit={save} className="flex items-center gap-2">
            <label htmlFor="goal" className="sr-only">
              Meta diária
            </label>
            <input
              id="goal"
              type="number"
              min={1}
              max={200}
              value={value}
              onChange={(e) => setValue(e.target.value)}
              className="h-9 w-16 rounded-[3px] border border-pn-ink bg-pn-card px-2 text-center font-pn-mono text-[14px]"
              autoFocus
            />
            <button
              type="submit"
              disabled={pending}
              className="min-h-[36px] rounded-[3px] bg-pn-ink px-3 text-[13px] font-semibold text-pn-paper"
            >
              Salvar
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => setEditing(true)}
            className="inline-flex min-h-[36px] items-center gap-1.5 text-[13px] text-pn-muted hover:text-pn-ink"
          >
            meta {goal}/dia <Pencil size={12} aria-hidden />
          </button>
        )}
      </div>

      <p className="mt-2 flex items-baseline gap-2">
        <span className="font-pn-display text-[56px] font-medium leading-none tracking-[-0.04em]">
          {done}
        </span>
        <span className="font-pn-mono text-[13px] text-pn-muted">
          de {goal}
        </span>
        {reached && (
          <span className="pn-stamp-in ml-2 rotate-[-2deg] rounded-[2px] border-[1.5px] border-pn-moss px-1.5 py-0.5 font-pn-mono text-[11px] font-bold uppercase tracking-[0.1em] text-pn-moss">
            meta batida
          </span>
        )}
      </p>

      <div
        role="img"
        aria-label={`${done} de ${goal} contatos feitos hoje`}
        className="mt-4 flex h-6 items-end gap-[3px]"
      >
        {Array.from({ length: ticks }).map((_, i) => (
          <span
            key={i}
            className={cn(
              'w-full max-w-[14px] flex-1 rounded-[1px] transition-colors',
              i < filled ? 'h-6 bg-pn-ink' : 'h-3 bg-pn-line',
              i % 5 === 4 && i >= filled && 'h-4',
            )}
          />
        ))}
      </div>
    </div>
  )
}
