import { cn } from '@/lib/utils'
import { STAGE_LABEL, type StageId } from '@/lib/leads/constants'

const STYLE: Record<StageId, string> = {
  novo: 'border-dashed border-pn-muted text-pn-muted',
  contatado: 'border-pn-ink text-pn-ink',
  demo_enviada: 'border-pn-ink bg-pn-ink text-pn-paper',
  respondeu: 'border-pn-gold text-pn-gold',
  reuniao: 'border-pn-gold bg-pn-gold text-white',
  proposta: 'border-pn-ink bg-pn-sunk text-pn-ink',
  fechado: 'border-pn-moss text-pn-moss -rotate-2 font-bold',
  perdido: 'border-pn-line text-pn-muted line-through',
}

/** Etapa do lead como um carimbo de caderno, em vez de um chip colorido. */
export function Stamp({
  stage,
  className,
}: {
  stage: StageId
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap rounded-[2px] border-[1.5px] px-1.5 py-[2px] font-pn-mono text-[10.5px] font-medium uppercase leading-none tracking-[0.1em]',
        STYLE[stage],
        className,
      )}
    >
      {STAGE_LABEL[stage]}
    </span>
  )
}

export function Tag({
  children,
  tone = 'plain',
  className,
}: {
  children: React.ReactNode
  tone?: 'plain' | 'signal' | 'gold'
  className?: string
}) {
  return (
    <span
      className={cn(
        'inline-flex items-center whitespace-nowrap font-pn-mono text-[11px] uppercase tracking-[0.08em]',
        tone === 'plain' && 'text-pn-muted',
        tone === 'signal' && 'font-semibold text-pn-signal',
        tone === 'gold' && 'text-pn-gold',
        className,
      )}
    >
      {children}
    </span>
  )
}
