import { getDb } from '../lib/db/client'
import { projects } from '../lib/db/schema'
import { slugify } from '../lib/utils'

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

async function main() {
  const db = getDb()

  let position = 0

  for (const project of IN_PROGRESS) {
    await db.insert(projects).values({
      title: project.title,
      slug: slugify(project.title),
      description: project.description,
      tags: project.tags,
      status: 'in_progress',
      published: true,
      position: position++,
    })
  }

  for (const project of OTHER_PROJECTS) {
    await db.insert(projects).values({
      title: project.title,
      slug: slugify(project.title),
      description: project.description,
      tags: project.tags,
      repoUrl: project.code,
      deployUrl: project.deploy,
      status: 'completed',
      published: true,
      position: position++,
    })
  }

  console.log(
    `Seed concluído: ${IN_PROGRESS.length + OTHER_PROJECTS.length} projetos inseridos.`,
  )
}

main().then(() => process.exit(0))
