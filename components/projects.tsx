'use client'

import Link from 'next/link'
import { motion } from 'motion/react'

const IN_PROGRESS = [
  {
    title: 'Site institucional',
    description:
      'Site institucional para negócio local, com foco em conversão.',
    tags: ['Next.js', 'Tailwind CSS', 'Vercel'],
  },
  {
    title: 'Dashboard administrativo',
    description: 'Painel com gráficos e CRUD completo pra gestão de dados.',
    tags: ['React', 'Node.js', 'Supabase', 'PostgreSQL'],
  },
  {
    title: 'Landing page com pagamento',
    description: 'Página de conversão com checkout integrado.',
    tags: ['Next.js', 'Stripe / Mercado Pago'],
  },
]

const OTHER_PROJECTS = [
  {
    title: 'FSWTrips',
    description: 'Simulação de plataforma de reservas de viagens e hotéis.',
    tags: ['Next.js', 'Prisma', 'Stripe', 'PostgreSQL'],
    code: 'https://github.com/phladev/FSWTrips',
    deploy: 'https://fsw-trips-phladev.vercel.app',
  },
  {
    title: 'FSWBarber Shop',
    description: 'Sistema de agendamento para barbearias.',
    tags: ['Next.js', 'Prisma', 'PostgreSQL'],
    code: 'https://github.com/phladev/fsw-barber-shop',
    deploy: 'https://fsw-barber-shop.vercel.app/',
  },
  {
    title: 'API para e-commerce',
    description: 'API REST para gestão de pedidos e produtos.',
    tags: ['Node.js', 'Express', 'PostgreSQL', 'Prisma'],
    code: 'https://github.com/phladev/ecommerce-api',
  },
]

const revealProps = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

const Projects = () => {
  return (
    <>
      <div className="mb-22 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {IN_PROGRESS.map((project, i) => (
          <motion.div
            key={project.title}
            {...revealProps(i * 0.05)}
            className="flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-surface p-7 transition-colors hover:border-accent-purple/40"
          >
            <div className="flex items-start justify-between gap-3">
              <h3 className="font-display text-xl font-medium text-ink">
                {project.title}
              </h3>
              <span className="flex items-center gap-1.5 whitespace-nowrap rounded-full border border-[oklch(78%_0.14_75/0.35)] bg-[oklch(78%_0.14_75/0.12)] px-2.5 py-1 font-mono text-[11px] text-[oklch(78%_0.14_75)]">
                <span className="block h-1.5 w-1.5 rounded-full bg-[oklch(78%_0.14_75)]" />
                Em desenvolvimento
              </span>
            </div>
            <p className="text-sm leading-relaxed text-muted2">
              {project.description}
            </p>
            <div className="mt-auto flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/[0.08] bg-white/5 px-2.5 py-1.5 font-mono text-xs text-muted2"
                >
                  {tag}
                </span>
              ))}
            </div>
          </motion.div>
        ))}
      </div>

      <div>
        <h3 className="mb-5 flex items-center gap-2.5 font-display text-[19px] font-medium text-muted2">
          <span className="font-mono text-sm text-accent-blue">&lt;&gt;</span>
          Outros projetos
        </h3>
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {OTHER_PROJECTS.map((project) => (
            <div
              key={project.title}
              className="flex flex-col gap-2.5 rounded-lg border border-white/[0.06] p-5 transition-colors hover:border-white/[0.14]"
            >
              <h4 className="font-display text-base font-medium text-ink">
                {project.title}
              </h4>
              <p className="text-[13px] leading-relaxed text-muted2">
                {project.description}
              </p>
              <div className="flex flex-wrap gap-1.5">
                {project.tags.map((tag) => (
                  <span
                    key={tag}
                    className="rounded-md bg-white/5 px-2 py-1 font-mono text-[11px] text-muted2"
                  >
                    {tag}
                  </span>
                ))}
              </div>
              <div className="mt-1 flex gap-4">
                <Link
                  href={project.code}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-[13px] text-muted2 transition-colors hover:text-accent-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
                >
                  Código
                </Link>
                {project.deploy && (
                  <Link
                    href={project.deploy}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-[13px] text-muted2 transition-colors hover:text-accent-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
                  >
                    Deploy
                  </Link>
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  )
}

export default Projects
