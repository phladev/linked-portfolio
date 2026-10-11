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

type FeaturedProjectsProps = {
  projects: Project[]
}

const FeaturedProjects = ({ projects }: FeaturedProjectsProps) => {
  if (projects.length === 0) return null

  return (
    <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
      {projects.map((project, i) => (
        <motion.article
          key={project.id}
          {...revealProps(i * 0.05)}
          className="group flex flex-col overflow-hidden rounded-xl border border-white/[0.06] bg-surface transition-colors hover:border-accent-purple/40"
        >
          <div className="relative aspect-[16/10] w-full overflow-hidden bg-white/5">
            {project.coverUrl ? (
              <Image
                src={project.coverUrl}
                alt={`Capa do projeto ${project.title}`}
                fill
                sizes="(min-width: 640px) 50vw, 100vw"
                className="object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                unoptimized
              />
            ) : (
              <div
                aria-hidden
                className="absolute inset-0 bg-gradient-to-br from-accent-purple/20 to-accent-blue/10"
              />
            )}
          </div>

          <div className="flex flex-1 flex-col gap-4 p-5 sm:p-7">
            <h3 className="font-display text-xl font-medium text-ink">
              {project.title}
            </h3>
            <p className="text-sm leading-relaxed text-muted2">
              {project.description}
            </p>

            <div className="flex flex-wrap gap-2">
              {project.tags.map((tag) => (
                <span
                  key={tag}
                  className="rounded-md border border-white/[0.08] bg-white/5 px-2.5 py-1.5 font-mono text-xs text-muted2"
                >
                  {tag}
                </span>
              ))}
            </div>

            {(project.deployUrl || project.repoUrl) && (
              <div className="mt-auto flex flex-wrap gap-x-5 gap-y-2 pt-1">
                {project.deployUrl && (
                  <Link
                    href={project.deployUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-medium text-accent-purple transition-opacity hover:opacity-80 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
                  >
                    Ver projeto →
                  </Link>
                )}
                {project.repoUrl && (
                  <Link
                    href={project.repoUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm text-muted2 transition-colors hover:text-accent-purple focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
                  >
                    Código
                  </Link>
                )}
              </div>
            )}
          </div>
        </motion.article>
      ))}
    </div>
  )
}

export default FeaturedProjects
