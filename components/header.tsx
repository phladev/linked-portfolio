'use client'

import Link from 'next/link'
import { useState } from 'react'

const NAV_LINKS = [
  { href: '#inicio', label: 'Início' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#como-trabalho', label: 'Como trabalho' },
  { href: '#sobre', label: 'Sobre' },
]

const Header = () => {
  const [menuOpen, setMenuOpen] = useState(false)
  const closeMenu = () => setMenuOpen(false)

  return (
    <>
      <header className="fixed inset-x-0 top-0 z-50 flex items-center justify-between border-b border-white/[0.08] bg-canvas/75 px-5 py-4 backdrop-blur-md sm:px-8 md:px-12">
        <Link
          href="#inicio"
          className="bg-gradient-to-br from-accent-blue to-accent-purple bg-clip-text font-mono text-lg font-medium tracking-tight text-transparent"
        >
          &lt;phladev /&gt;
        </Link>

        <nav className="hidden items-center gap-8 md:flex">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="text-[15px] text-muted2 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-accent-purple"
            >
              {link.label}
            </Link>
          ))}
          <Link
            href="#contato"
            className="rounded-lg bg-gradient-to-br from-accent-blue to-accent-purple px-5 py-2.5 text-[15px] font-medium text-canvas transition-[filter] hover:brightness-110 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-ink"
          >
            Contato
          </Link>
        </nav>

        <button
          onClick={() => setMenuOpen(true)}
          aria-label="Abrir menu"
          className="flex flex-col gap-[5px] p-2 md:hidden"
        >
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="block h-0.5 w-6 bg-ink" />
          <span className="block h-0.5 w-6 bg-ink" />
        </button>
      </header>

      {menuOpen && (
        <div className="fixed inset-0 z-[60] flex flex-col items-center justify-center gap-9 bg-canvas md:hidden">
          <button
            onClick={closeMenu}
            aria-label="Fechar menu"
            className="absolute right-6 top-5 text-3xl leading-none text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
          >
            ×
          </button>
          {[...NAV_LINKS, { href: '#contato', label: 'Contato' }].map(
            (link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={closeMenu}
                className="font-display text-3xl font-medium text-ink transition-colors hover:text-accent-purple"
              >
                {link.label}
              </Link>
            ),
          )}
        </div>
      )}
    </>
  )
}

export default Header
