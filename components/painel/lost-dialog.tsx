'use client'

import { useEffect, useRef, useState } from 'react'
import { Btn, inputCls } from './ui'

const QUICK = [
  'Sem interesse',
  'Já tem site',
  'Sem orçamento',
  'Não respondeu',
  'Fechou com outro',
]

/** Pergunta o motivo antes de marcar um lead como perdido (alimenta as métricas). */
export function LostDialog({
  name,
  onConfirm,
  onCancel,
}: {
  name: string
  onConfirm: (reason: string) => void
  onCancel: () => void
}) {
  const ref = useRef<HTMLDialogElement>(null)
  const [reason, setReason] = useState('')

  useEffect(() => {
    ref.current?.showModal()
  }, [])

  return (
    <dialog
      ref={ref}
      onClose={onCancel}
      onClick={(e) => e.target === ref.current && onCancel()}
      className="m-auto w-[calc(100%-24px)] max-w-md rounded-[3px] border border-pn-ink/20 bg-pn-card p-0 text-pn-ink shadow-[0_24px_60px_-20px_rgba(29,26,22,0.45)] backdrop:bg-pn-ink/45"
    >
      <form
        onSubmit={(e) => {
          e.preventDefault()
          onConfirm(reason)
        }}
      >
        <div className="border-b border-pn-line px-5 py-4">
          <h2 className="font-pn-display text-[24px] font-medium leading-none tracking-[-0.02em]">
            Por que perdeu?
          </h2>
          <p className="mt-1.5 truncate text-[13px] text-pn-muted">{name}</p>
        </div>
        <div className="space-y-3 px-5 py-5">
          <div className="flex flex-wrap gap-2">
            {QUICK.map((q) => (
              <button
                key={q}
                type="button"
                onClick={() => setReason(q)}
                aria-pressed={reason === q}
                className={`min-h-[36px] rounded-[3px] border px-3 text-[13px] transition-colors ${
                  reason === q
                    ? 'border-pn-ink bg-pn-ink text-pn-paper'
                    : 'border-pn-line hover:border-pn-ink/50'
                }`}
              >
                {q}
              </button>
            ))}
          </div>
          <label htmlFor="lost-reason" className="sr-only">
            Motivo
          </label>
          <input
            id="lost-reason"
            value={reason}
            onChange={(e) => setReason(e.target.value)}
            placeholder="Ou escreva o motivo"
            className={inputCls}
          />
        </div>
        <div className="flex justify-end gap-2 border-t border-pn-line px-5 py-4">
          <Btn variant="ghost" onClick={onCancel}>
            Cancelar
          </Btn>
          <Btn type="submit" variant="ink">
            Marcar como perdido
          </Btn>
        </div>
      </form>
    </dialog>
  )
}
