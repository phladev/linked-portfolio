import Link from 'next/link'
import { Badge } from './ui/badge'
import { Github, Rocket } from 'lucide-react'
import Image from 'next/image'

const ReposGrid = () => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div className="border-zinc-300 text-white rounded-md border shadow-md p-4">
        <h4 className="font-semibold text-center">FSWTrips</h4>
        <div className="w-full md:flex justify-center p-4 hidden">
          <Image
            src="https://res.cloudinary.com/dxsut9uov/image/upload/v1731077591/fswTripsBanner.png"
            alt="Banner promocional da FSW Trips, com visual atraente e logotipo destacado"
            width={550}
            height={500}
            priority
            className="rounded-md"
          />
        </div>
        <p className="text-sm">
          FSW Trips é um projeto que simula um site de reservas de hotéis e
          viagens, onde os usuários podem fazer login com sua conta do Google,
          buscar viagens de seu interesse, seja procurando por um tipo
          específico de hotel ou localidade. Foi meu primeiro grande projeto de
          estudos, onde pude botar em prática novos conhecimentos como Nextjs,
          PrismaORM, Stripe, entre outros.
        </p>
        <div className="flex items-center gap-2 mt-6 flex-wrap">
          <Badge variant="secondary">Nextjs</Badge>
          <Badge variant="secondary">Typescript</Badge>
          <Badge variant="secondary">PostgreSQL</Badge>
          <Badge variant="secondary">PrismaORM</Badge>
        </div>
        <div className="flex items-center gap-2 mt-6 text-white">
          <Link
            href="https://github.com/phladev/FSWTrips"
            className="flex items-center gap-2 border border-zinc-300 p-3 rounded-md hover:border-purple-700"
            target="_blank"
          >
            <Github width={22} height={22} />
            <span className="text-sm">Código</span>
          </Link>

          <Link
            href="https://fsw-trips-phladev.vercel.app"
            className="flex items-center gap-2 border border-zinc-300 p-3 rounded-md hover:border-purple-700"
            target="_blank"
          >
            <Rocket width={22} height={22} />
            <span className="text-sm">Deploy</span>
          </Link>
        </div>
      </div>

      <div className="border-zinc-300 text-white rounded-md border shadow-md p-4">
        <h4 className="font-semibold text-center">FSWBarber Shop</h4>
        <div className="w-full md:flex justify-center p-4 hidden">
          <Image
            src="https://res.cloudinary.com/dxsut9uov/image/upload/v1731077924/fswBarberBanner.png"
            alt="Banner promocional da FSW BarberShop, com visual atraente e logotipo destacado"
            width={550}
            height={500}
            priority
            className="rounded-md"
          />
        </div>
        <p className="text-sm">
          FSWBarber Shop é um projeto que simula um sistema de reservas para
          barbearias, onde os usuários podem fazer login com sua conta do
          Google, agendar cortes de cabelo e serviços de barbearia de seu
          interesse, escolhendo um horário conveniente.
        </p>
        <div className="flex items-center gap-2 mt-6 flex-wrap">
          <Badge variant="secondary">Nextjs</Badge>
          <Badge variant="secondary">Typescript</Badge>
          <Badge variant="secondary">PostgreSQL</Badge>
          <Badge variant="secondary">PrismaORM</Badge>
        </div>
        <div className="flex items-center gap-2 mt-6">
          <Link
            href="https://github.com/phladev/fsw-barber-shop"
            className="flex items-center gap-2 border border-zinc-300 p-3 rounded-md hover:border-purple-700"
            target="_blank"
          >
            <Github width={22} height={22} />
            <span className="text-sm">Código</span>
          </Link>

          <Link
            href="https://fsw-barber-shop.vercel.app/"
            className="flex items-center gap-2 border border-zinc-300 p-3 rounded-md hover:border-purple-700"
            target="_blank"
          >
            <Rocket width={22} height={22} />
            <span className="text-sm">Deploy</span>
          </Link>
        </div>
      </div>

      <div className="border-zinc-300 text-white rounded-md border shadow-md p-4">
        <h4 className="font-semibold text-center">API para ecommerce</h4>
        <p className="text-sm">
          Esta é uma API em desenvolvimento para um ecommerce. A API suporta
          funcionalidades básicas para um ecommerce, incluindo contas para
          administradores e usuários, gerenciamento de pedidos (orders) e
          produtos (products). O projeto está em desenvolvimento contínuo, com
          novas funcionalidades e melhorias planejadas para o futuro.
        </p>
        <div className="flex items-center gap-2 mt-6 flex-wrap">
          <Badge variant="secondary">Nodejs</Badge>
          <Badge variant="secondary">Expressjs</Badge>
          <Badge variant="secondary">Typescript</Badge>
          <Badge variant="secondary">PostgreSQL</Badge>
          <Badge variant="secondary">PrismaORM</Badge>
        </div>
        <div className="flex items-center gap-2 mt-6">
          <Link
            href="https://github.com/phladev/ecommerce-api"
            className="flex items-center gap-2 border border-zinc-300 p-3 rounded-md hover:border-purple-700"
            target="_blank"
          >
            <Github width={22} height={22} />
            <span className="text-sm">Código</span>
          </Link>
        </div>
      </div>
    </div>
  )
}

export default ReposGrid
