'use client'

import { ChevronsDown, FileDown, Github, Linkedin } from 'lucide-react'
import ReposGrid from '@/components/reposGrid'
import Image from 'next/image'
import Carousel from '@/components/carousel'
import SkillTabs from '@/components/skillsTabs'
import Link from 'next/link'
import ContactForm from '@/components/contactForm'
import Footer from '@/components/footer'
import BackToTop from '@/components/backToTop'
import { motion } from 'motion/react'

export default function Home() {
  return (
    <div>
      <main className="p-5 mt-24 md:container w-full m-auto relative scroll-smooth">
        <section className="w-full h-[75vh] py-5 space-y-56" id="home">
          {/* Info */}
          <div className="flex items-center justify-between text-white">
            <motion.div
              initial={{ left: -200, opacity: 0 }}
              animate={{ left: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="flex relative flex-col justify-center"
            >
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
            </motion.div>
            {/* Image only on bigger screens */}
            <motion.div
              initial={{ right: -200, opacity: 0 }}
              animate={{ right: 0, opacity: 1 }}
              transition={{ duration: 0.5 }}
              className="hidden md:flex relative"
            >
              <Image
                src="/coding.svg"
                alt="Imagem cartonizada de um homem programando"
                width={550}
                height={550}
                priority
              />
            </motion.div>
          </div>
          <motion.div
            initial={{ bottom: -200, opacity: 0 }}
            animate={{ bottom: 0, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="w-full relative flex justify-center text-purple-700 animate-bounce"
          >
            <ChevronsDown size={32} />
          </motion.div>
        </section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="p-5 mt-24 w-full"
          id="projects"
        >
          <div className="flex flex-col gap-6 justify-center w-full">
            <div className="flex justify-center items-center w-full">
              <h3 className="text-xl md:text-2xl border-b-2 border-purple-700 text-white">
                <strong>Projetos em Destaque</strong>
              </h3>
            </div>

            <ReposGrid />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="p-5 mt-24 w-full"
          id="abilities"
        >
          <div className="flex flex-col gap-6 justify-center w-full">
            <div className="flex justify-center items-center w-full">
              <h3 className="text-xl md:text-2xl border-b-2 border-purple-700 text-white">
                <strong>Habilidades</strong>
              </h3>
            </div>

            <div className="flex justify-center items-center w-full">
              <SkillTabs />
            </div>
          </div>
          <div className="mt-10">
            <Carousel />
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="p-5 mt-24 w-full"
          id="contact"
        >
          <div className="flex flex-col gap-6 justify-center w-full">
            <div className="flex justify-center items-center w-full">
              <h3 className="text-xl md:text-2xl border-b-2 border-purple-700 text-white">
                <strong>Contato</strong>
              </h3>
            </div>

            <div className="flex flex-col md:flex-row gap-12">
              <ContactForm />

              <div className="flex-1 flex flex-col justify-center items-center space-y-8 text-white">
                <p className="text-xl text-center">
                  Entre em contato por aqui também:
                </p>
                <div className="flex space-x-6">
                  <Link
                    href="https://github.com/phladev"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#7e22ce] transition-colors"
                  >
                    <Github size={36} />
                    <span className="sr-only">GitHub</span>
                  </Link>
                  <Link
                    href="https://www.linkedin.com/in/pedrohldev/"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#7e22ce] transition-colors"
                  >
                    <Linkedin size={36} />
                    <span className="sr-only">LinkedIn</span>
                  </Link>
                  <Link
                    href="/CV.pdf"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-white hover:text-[#7e22ce] transition-colors"
                  >
                    <FileDown size={36} />
                    <span className="sr-only">Download Currículo</span>
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </motion.section>
      </main>
      <BackToTop />
      <Footer />
    </div>
  )
}
