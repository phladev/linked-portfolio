'use client'

import { Plus } from 'lucide-react'
import { buttonCls } from './ui'

export function OpenCapture({
  children = 'Novo lead',
  variant = 'signal',
}: {
  children?: React.ReactNode
  variant?: 'signal' | 'ink' | 'outline'
}) {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event('painel:capture'))}
      className={buttonCls(variant)}
    >
      <Plus size={17} aria-hidden />
      {children}
    </button>
  )
}
