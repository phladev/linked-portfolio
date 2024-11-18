import { Github, Linkedin, Mail, MapPin } from 'lucide-react'
import Link from 'next/link'

const Footer = () => {
  return (
    <footer className="bg-[#171C28] text-white py-12 border-t-2 border-purple-700 mt-24">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-[#7e22ce]">
              Pedro Henrique
            </h3>
            <p className="text-sm">Web Developer</p>
            <p className="text-sm flex items-center gap-2">
              <MapPin size={16} className="text-purple-700" />
              São João del Rei - MG, Brasil
            </p>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-700">
              Links Rápidos
            </h3>
            <ul className="space-y-2">
              <li>
                <Link
                  href="#"
                  className="text-sm hover:text-purple-700 transition-colors"
                >
                  Início
                </Link>
              </li>
              <li>
                <Link
                  href="#projects"
                  className="text-sm hover:text-purple-700 transition-colors"
                >
                  Projetos
                </Link>
              </li>
              <li>
                <Link
                  href="#abilities"
                  className="text-sm hover:text-purple-700 transition-colors"
                >
                  Habilidades
                </Link>
              </li>
              <li>
                <Link
                  href="#contact"
                  className="text-sm hover:text-purple-700 transition-colors"
                >
                  Contato
                </Link>
              </li>
            </ul>
          </div>
          <div className="space-y-4">
            <h3 className="text-xl font-semibold text-purple-700">
              Entre em Contato
            </h3>
            <p className="text-sm flex items-center gap-2">
              <Mail size={16} className="text-purple-700" />
              phladev05@gmail.com
            </p>
            <div className="flex space-x-4">
              <a
                href="https://github.com/phladev"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-700 transition-colors"
              >
                <Github size={24} />
                <span className="sr-only">GitHub</span>
              </a>
              <a
                href="https://www.linkedin.com/in/pedrohldev/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-white hover:text-purple-700 transition-colors"
              >
                <Linkedin size={24} />
                <span className="sr-only">LinkedIn</span>
              </a>
            </div>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t border-white/10 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} Pedro Henrique. Todos os direitos
            reservados.
          </p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
