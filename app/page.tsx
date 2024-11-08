import ReposGrid from '@/components/reposGrid'
import Image from 'next/image'

export default function Home() {
  return (
    <div>
      <main className="p-5 mt-24 md:container w-full m-auto relative scroll-smooth">
        <section className="w-full py-5" id="home">
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
        </section>

        <section className="p-5 mt-24 w-full" id="projects">
          <div className="flex flex-col gap-6 justify-center w-full">
            <div className="flex justify-center items-center w-full">
              <h3 className="text-xl md:text-2xl border-b-2 border-purple-700 text-white">
                <strong>Projetos em Destaque</strong>
              </h3>
            </div>

            <ReposGrid />
          </div>
        </section>
      </main>
    </div>
  )
}
