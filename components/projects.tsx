'use client'

import Link from 'next/link'
import Image from 'next/image'
import { motion } from 'motion/react'
import type { Project } from '@/lib/db/queries/projects'

const revealProps = (delay = 0) => ({
  initial: { opacity: 0, y: 20 },
  whileInView: { opacity: 1, y: 0 },
  viewport: { once: true },
  transition: { duration: 0.6, delay },
})

type ProjectsProps = {
  projects: Project[]
}

const Projects = ({ projects }: ProjectsProps) => {
  const inProgress = projects.filter(
    (project) => project.status === 'in_progress',
  )
  const otherProjects = projects.filter(
    (project) => project.status !== 'in_progress',
  )

  if (projects.length === 0) {
    return (
      <p className="text-sm text-muted2">Novos projetos em breve por aqui.</p>
    )
  }

  return (
    <>
      {inProgress.length > 0 && (
        <div className="mb-16 grid grid-cols-1 gap-6 sm:mb-20 sm:grid-cols-2 lg:grid-cols-3">
          {inProgress.map((project, i) => (
            <motion.div
              key={project.id}
              {...revealProps(i * 0.05)}
              className="flex flex-col gap-4 rounded-xl border border-white/[0.06] bg-surface p-5 transition-colors hover:border-accent-purple/40 sm:p-7"
            >
              {project.coverUrl && (
                <div className="relative -mx-1 -mt-1 h-36 overflow-hidden rounded-lg">
                  <Image
                    src={project.coverUrl}
                    alt=""
                    fill
                    className="object-cover"
                    unoptimized
                  />
                </div>
              )}
              <div className="flex flex-col items-start gap-3 sm:flex-row sm:justify-between">
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
      )}

      {otherProjects.length > 0 && (
        <div>
          <h3 className="mb-5 flex items-center gap-2.5 font-display text-[19px] font-medium text-muted2">
            <span className="font-mono text-sm text-accent-blue">&lt;&gt;</span>
            Outros projetos
          </h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {otherProjects.map((project) => (
              <div
                key={project.id}
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
                  {project.repoUrl && (
                    <Link
                      href={project.repoUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[13px] text-muted2 transition-colors hover:text-accent-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
                    >
                      Código
                    </Link>
                  )}
                  {project.deployUrl && (
                    <Link
                      href={project.deployUrl}
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
      )}
    </>
  )
}

export default Projects
