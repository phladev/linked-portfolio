'use client'

import { motion } from 'motion/react'

const STEPS = [
  {
    number: '01',
    title: 'Briefing',
    description: 'Entendo o problema e o objetivo do seu negócio.',
  },
  {
    number: '02',
    title: 'Proposta',
    description: 'Escopo e valor fechado por projeto, não por hora.',
  },
  {
    number: '03',
    title: 'Desenvolvimento',
    description: 'Ciclos curtos, com pontos de revisão.',
  },
  {
    number: '04',
    title: 'Entrega e suporte',
    description: '30 dias de suporte a bugs após a entrega.',
  },
]

const HowIWork = () => {
  return (
    <div className="flex flex-col">
      {STEPS.map((step, i) => (
        <motion.div
          key={step.number}
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.05 }}
          className={`flex gap-6 py-7 ${i < STEPS.length - 1 ? 'border-b border-white/[0.08]' : ''}`}
        >
          <span className="min-w-[52px] shrink-0 bg-gradient-to-br from-accent-blue to-accent-purple bg-clip-text font-mono text-[28px] font-medium text-transparent">
            {step.number}
          </span>
          <div className="flex flex-col gap-1.5">
            <span className="font-display text-lg font-medium text-ink">
              {step.title}
            </span>
            <span className="text-sm leading-relaxed text-muted2">
              {step.description}
            </span>
          </div>
        </motion.div>
      ))}
    </div>
  )
}

export default HowIWork
