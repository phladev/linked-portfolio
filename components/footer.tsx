import Link from 'next/link'

const NAV_LINKS = [
  { href: '#inicio', label: 'Início' },
  { href: '#projetos', label: 'Projetos' },
  { href: '#como-trabalho', label: 'Como trabalho' },
  { href: '#sobre', label: 'Sobre' },
  { href: '#contato', label: 'Contato' },
]

const Footer = () => {
  return (
    <footer className="mx-auto flex max-w-6xl flex-col items-center gap-6 px-6 pb-10 pt-14 text-center">
      <div className="flex flex-col gap-1">
        <span className="font-display text-base font-medium text-ink">
          Pedro Henrique — Web Developer
        </span>
        <span className="text-[13px] text-muted2">
          São João del Rei - MG, Brasil
        </span>
      </div>
      <nav className="flex flex-wrap justify-center gap-5">
        {NAV_LINKS.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="text-[13px] text-muted2 transition-colors hover:text-ink focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent-purple"
          >
            {link.label}
          </Link>
        ))}
      </nav>
      <span className="text-xs text-muted2">
        © {new Date().getFullYear()} Pedro Henrique. Todos os direitos
        reservados.
      </span>
    </footer>
  )
}

export default Footer
