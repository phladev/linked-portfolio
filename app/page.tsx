import { ChevronsDown } from 'lucide-react'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <main className="p-5 mt-24 md:container w-full m-auto relative scroll-smooth">
        <section className="w-full h-[75vh] py-5 space-y-56" id="home">
          {/* Info */}
          <div className="flex items-center justify-between text-white">
            <div className="flex flex-col justify-center">
              <p className="font-light md:text-xl">Olá, me chamo</p>
              <h1 className="text-5xl md:text-6xl">
                <strong>Pedro Henrique</strong>
              </h1>
              <p className="text-lg md:text-2xl text-purple-700">
                <cite>Desenvolvedor Fullstack</cite>
              </p>

              <div className="mt-4 flex items-center gap-4 text-start">
                <p className="text-sm md:text-lg md:w-[75%]">
                  Se você precisa de uma solução tecnológica eficiente, com as
                  melhores práticas está no lugar certo!. Seja bem-vindo(a) e
                  fique à vontade para explorar meu trabalho!
                </p>
              </div>
            </div>
            {/* Image only on bigger screens */}
            <div className="hidden md:flex">
              <Image
                src="/coding.svg"
                alt="Imagem cartonizada de um homem programando"
                width={550}
                height={550}
                priority
              />
            </div>
          </div>
          <div className="w-full flex justify-center text-purple-700 animate-bounce">
            <ChevronsDown size={32} />
          </div>
        </section>
      </main>
    </div>
  )
}
