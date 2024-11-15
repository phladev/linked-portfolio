import Link from 'next/link'
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from './ui/sheet'
import { Menu } from 'lucide-react'

const Header = () => {
  return (
    <header className="w-full flex items-center justify-between h-20 border-b px-5 border-b-slate-100">
      <h3 className="font-bold text-sm md:text-lg text-white">
        &lt;phladev /&gt;
      </h3>
      <Sheet>
        <SheetTrigger className="flex md:hidden">
          <Menu className="text-white" />
        </SheetTrigger>
        <SheetContent className="bg-[#171C28] text-white border-none">
          <SheetHeader>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Opções do menu
            </SheetDescription>
            <nav className="h-full mt-10">
              <ul className="flex flex-col items-center gap-3">
                <li className="text-lg md:text-lg hover:border-b border-b-slate-100 text-white hover:font-bold">
                  <Link href="#home">Início</Link>
                </li>
                <li className="text-lg md:text-lg hover:border-b border-b-slate-100 text-white hover:font-bold">
                  <Link href="#projects">Projetos</Link>
                </li>
                <li className="text-lg md:text-lg hover:border-b border-b-slate-100 text-white hover:font-bold">
                  <Link href="#abilities">Habilidades</Link>
                </li>
                <li className="text-lg md:text-lg hover:border-b border-b-slate-100 text-white hover:font-bold">
                  <Link href="#contact">Contato</Link>
                </li>
              </ul>
            </nav>
          </SheetHeader>
        </SheetContent>
      </Sheet>
      <nav className="hidden md:flex">
        <ul className="flex items-center gap-3">
          <li className="text-sm md:text-lg hover:border-b border-b-slate-100 text-white hover:font-bold">
            <Link href="#">Início</Link>
          </li>
          <li className="text-sm md:text-lg hover:border-b border-b-slate-100 text-white hover:font-bold">
            <Link href="#projects">Projetos</Link>
          </li>
          <li className="text-sm md:text-lg hover:border-b border-b-slate-100 text-white hover:font-bold">
            <Link href="#abilities">Habilidades</Link>
          </li>
          <li className="text-sm md:text-lg hover:border-b border-b-slate-100 text-white hover:font-bold">
            <Link href="#contact">Contato</Link>
          </li>
        </ul>
      </nav>
    </header>
  )
}

export default Header
