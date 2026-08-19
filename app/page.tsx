'use client'

import Link from 'next/link'
import { motion } from 'motion/react'
import Projects from '@/components/projects'
import HowIWork from '@/components/howIWork'
import ContactForm from '@/components/contactForm'
import Footer from '@/components/footer'

const STACK = [
  'React',
  'Next.js',
  'Node.js',
  'TypeScript',
  'Tailwind CSS',
  'PostgreSQL',
  'Supabase',
  'MongoDB',
  'MySQL',
  'Git/GitHub',
  'PHP',
]

const heroReveal = (delay = 0) => ({
  initial: { opacity: 0, y: 16 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.7, delay },
})

const sectionReveal = {
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6 },
}

export default function Home() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-canvas">
      <section
        id="inicio"
        className="relative flex flex-col items-center justify-center overflow-hidden px-6 pb-16 pt-28 text-center sm:min-h-screen sm:pb-24 sm:pt-36"
      >
        <div
          aria-hidden
          className="pointer-events-none absolute inset-0 [background-image:radial-gradient(circle_at_1px_1px,rgba(160,163,173,0.3)_1px,transparent_0)] [background-size:34px_34px] [-webkit-mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_68%)] [mask-image:radial-gradient(ellipse_at_center,black_0%,transparent_68%)]"
        />
        <div
          aria-hidden
          className="pointer-events-none absolute left-1/2 top-1/2 h-[900px] w-[900px] -translate-x-1/2 -translate-y-1/2 rounded-full [background:radial-gradient(circle,rgba(55,138,221,0.2),transparent_70%)]"
        />

        <div className="relative z-[1] flex max-w-[760px] flex-col items-center gap-5">
          <motion.span
            {...heroReveal()}
            className="font-mono text-[clamp(22px,3vw,28px)] tracking-wide text-accent-purple"
          >
            &lt;phladev /&gt;
          </motion.span>

          <motion.h1
            {...heroReveal(0.05)}
            className="font-display text-[clamp(40px,6vw,64px)] font-medium leading-[1.05] text-ink"
          >
            Pedro Henrique
          </motion.h1>

          <motion.p
            {...heroReveal(0.1)}
            className="text-[clamp(18px,2.4vw,22px)] text-muted2"
          >
            Desenvolvedor Fullstack
          </motion.p>

          <motion.p
            {...heroReveal(0.15)}
            className="mt-3 max-w-[600px] bg-gradient-to-br from-accent-blue to-accent-purple bg-clip-text font-display text-[clamp(20px,2.6vw,26px)] font-medium text-transparent"
          >
            Desenvolvimento web sob medida, do conceito ao deploy.
          </motion.p>

          <motion.p
            {...heroReveal(0.2)}
            className="max-w-[560px] text-base leading-relaxed text-muted2"
          >
            Sites, sistemas e produtos digitais para negócios que querem
            presença online de verdade — e para quem busca um profissional
            completo pro time.
          </motion.p>

          <motion.div
            {...heroReveal(0.25)}
            className="mt-3 flex w-full flex-col justify-center gap-4 sm:w-auto sm:flex-row sm:flex-wrap"
          >
            <Link
              href="#contato"
              className="rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple px-7 py-3.5 text-base font-medium text-canvas transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink"
            >
              Vamos conversar sobre seu projeto
            </Link>
            <Link
              href="/CV.pdf"
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-lg border border-white/[0.16] px-6 py-3.5 text-base font-medium text-ink transition-colors hover:border-accent-purple hover:text-accent-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent-purple"
            >
              Ver currículo →
            </Link>
          </motion.div>
        </div>
      </section>

      <section
        id="projetos"
        className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-28"
      >
        <motion.div {...sectionReveal} className="mb-3 flex items-center gap-3">
          <span className="font-mono text-xl text-accent-blue">&lt;/&gt;</span>
          <h2 className="font-display text-[clamp(28px,4vw,38px)] font-medium text-ink">
            Projetos em construção
          </h2>
        </motion.div>
        <motion.p
          {...sectionReveal}
          className="mb-12 max-w-xl text-base text-muted2"
        >
          Estou desenvolvendo três projetos autorais pra colocar aqui em breve,
          com case study completo assim que estiverem prontos.
        </motion.p>

        <Projects />
      </section>

      <section
        id="como-trabalho"
        className="border-y border-white/[0.06] bg-surface px-6 py-14 sm:px-8 sm:py-24"
      >
        <div className="mx-auto max-w-3xl">
          <motion.div
            {...sectionReveal}
            className="mb-8 flex items-center gap-3 sm:mb-12"
          >
            <span className="font-mono text-xl text-accent-blue">
              &lt;/&gt;
            </span>
            <h2 className="font-display text-[clamp(28px,4vw,38px)] font-medium text-ink">
              Como trabalho
            </h2>
          </motion.div>

          <HowIWork />
        </div>
      </section>

      <section
        id="sobre"
        className="mx-auto max-w-6xl px-6 py-16 sm:px-8 sm:py-28"
      >
        <motion.div {...sectionReveal} className="mb-8 flex items-center gap-3">
          <span className="font-mono text-xl text-accent-blue">&lt;/&gt;</span>
          <h2 className="font-display text-[clamp(28px,4vw,38px)] font-medium text-ink">
            Sobre
          </h2>
        </motion.div>

        <div className="flex flex-wrap items-start gap-10 sm:gap-14">
          <motion.p
            {...sectionReveal}
            className="min-w-[280px] flex-[2_1_380px] text-base leading-loose text-muted2"
          >
            Sou desenvolvedor fullstack, atualmente diretor em uma empresa
            júnior da minha faculdade em São João del Rei (MG), onde lidero
            projetos e pessoas além de programar. Já atuei como freelancer e
            estagiário, e hoje estou construindo minha atuação independente,
            ajudando pequenos negócios a terem presença digital sólida — sites
            rápidos, sistemas sob medida e integrações que realmente funcionam
            no dia a dia.
          </motion.p>

          <motion.div
            {...sectionReveal}
            className="flex flex-[1_1_260px] flex-col gap-4"
          >
            <span className="font-mono text-xs uppercase tracking-wider text-muted2">
              Stack técnica
            </span>
            <div className="flex flex-wrap gap-2">
              {STACK.map((tech) => (
                <span
                  key={tech}
                  className="rounded-md border border-white/[0.08] bg-surface px-2.5 py-1.5 font-mono text-xs text-muted2"
                >
                  {tech}
                </span>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section
        id="contato"
        className="border-t border-white/[0.06] bg-surface px-6 py-16 sm:px-8 sm:py-28"
      >
        <div className="mx-auto grid max-w-4xl grid-cols-1 gap-10 sm:grid-cols-2 sm:gap-14">
          <motion.div {...sectionReveal} className="flex flex-col gap-6">
            <div className="flex items-center gap-3">
              <span className="font-mono text-xl text-accent-blue">
                &lt;/&gt;
              </span>
              <h2 className="font-display text-[clamp(26px,3.6vw,34px)] font-medium text-ink">
                Vamos conversar sobre o seu projeto.
              </h2>
            </div>
            <a
              href="mailto:phladev05@gmail.com"
              className="w-fit bg-gradient-to-br from-accent-blue to-accent-purple bg-clip-text font-display text-xl font-medium text-transparent focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent-purple"
            >
              phladev05@gmail.com
            </a>
            <div className="flex flex-wrap gap-5">
              <Link
                href="https://github.com/phladev"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-white/[0.16] text-[15px] text-ink transition-colors hover:border-accent-purple hover:text-accent-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent-purple"
              >
                GitHub
              </Link>
              <Link
                href="https://www.linkedin.com/in/pedrohldev/"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-white/[0.16] text-[15px] text-ink transition-colors hover:border-accent-purple hover:text-accent-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent-purple"
              >
                LinkedIn
              </Link>
              <Link
                href="/CV.pdf"
                target="_blank"
                rel="noopener noreferrer"
                className="border-b border-white/[0.16] text-[15px] text-ink transition-colors hover:border-accent-purple hover:text-accent-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-accent-purple"
              >
                Baixar currículo
              </Link>
            </div>
          </motion.div>

          <motion.div
            {...sectionReveal}
            transition={{ duration: 0.6, delay: 0.1 }}
          >
            <ContactForm />
          </motion.div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
