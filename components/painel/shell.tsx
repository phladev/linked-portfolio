'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useEffect, useState } from 'react'
import {
  CalendarCheck,
  ChartNoAxesColumn,
  ExternalLink,
  FolderKanban,
  Kanban,
  LogOut,
  MessageSquareText,
  MoreHorizontal,
  Plus,
  Send,
  Users,
  X,
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { CaptureDialog } from './capture-dialog'

const NAV = [
  { href: '/admin', label: 'Hoje', icon: CalendarCheck, exact: true },
  { href: '/admin/funil', label: 'Funil', icon: Kanban },
  { href: '/admin/leads', label: 'Leads', icon: Users },
  { href: '/admin/demos', label: 'Demos', icon: Send },
  { href: '/admin/modelos', label: 'Modelos', icon: MessageSquareText },
  { href: '/admin/metricas', label: 'Métricas', icon: ChartNoAxesColumn },
  { href: '/admin/projects', label: 'Projetos', icon: FolderKanban },
] as const

const MOBILE_MAIN = [
  '/admin',
  '/admin/funil',
  '/admin/leads',
  '/admin/metricas',
]

export function Shell({
  dueCount,
  signOutAction,
  children,
}: {
  dueCount: number
  signOutAction: () => Promise<void>
  children: React.ReactNode
}) {
  const pathname = usePathname()
  const [capture, setCapture] = useState(false)
  const [more, setMore] = useState(false)

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault()
        setCapture(true)
      }
    }
    const onOpen = () => setCapture(true)
    window.addEventListener('keydown', onKey)
    window.addEventListener('painel:capture', onOpen)
    return () => {
      window.removeEventListener('keydown', onKey)
      window.removeEventListener('painel:capture', onOpen)
    }
  }, [])

  useEffect(() => setMore(false), [pathname])

  const isActive = (item: (typeof NAV)[number]) =>
    'exact' in item && item.exact
      ? pathname === item.href
      : pathname.startsWith(item.href)

  const mobileMain = NAV.filter((n) => MOBILE_MAIN.includes(n.href))
  const mobileMore = NAV.filter((n) => !MOBILE_MAIN.includes(n.href))
  const moreActive = mobileMore.some(isActive)

  return (
    <div className="painel min-h-dvh">
      <a
        href="#conteudo"
        className="sr-only focus:not-sr-only focus:fixed focus:left-3 focus:top-3 focus:z-[60] focus:rounded-[3px] focus:bg-pn-ink focus:px-4 focus:py-2 focus:text-pn-paper"
      >
        Pular para o conteúdo
      </a>

      {/* Barra lateral (desktop) */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[232px] flex-col border-r border-pn-line bg-pn-card/70 backdrop-blur-sm lg:flex">
        <div className="px-6 pb-5 pt-7">
          <p className="font-pn-display text-[28px] font-medium italic leading-none tracking-[-0.03em]">
            prospecção
          </p>
          <p className="mt-2 font-pn-mono text-[10.5px] uppercase tracking-[0.14em] text-pn-muted">
            caderno de campo
          </p>
        </div>

        <nav aria-label="Principal" className="flex-1 space-y-0.5 px-3">
          {NAV.map((item) => {
            const active = isActive(item)
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'group relative flex min-h-[42px] items-center gap-3 rounded-[3px] px-3 text-[14.5px] font-medium transition-colors',
                  active
                    ? 'bg-pn-ink text-pn-paper'
                    : 'text-pn-ink/80 hover:bg-pn-sunk hover:text-pn-ink',
                )}
              >
                <Icon size={17} strokeWidth={1.75} aria-hidden />
                <span className="flex-1">{item.label}</span>
                {item.href === '/admin' && dueCount > 0 && (
                  <span
                    className={cn(
                      'min-w-[22px] rounded-[2px] px-1.5 py-0.5 text-center font-pn-mono text-[11px] font-semibold leading-none',
                      active
                        ? 'bg-pn-paper text-pn-signal'
                        : 'bg-pn-signal text-white',
                    )}
                  >
                    <span className="sr-only">para hoje: </span>
                    {dueCount}
                  </span>
                )}
              </Link>
            )
          })}
        </nav>

        <div className="space-y-2 border-t border-pn-line p-3">
          <button
            type="button"
            onClick={() => setCapture(true)}
            className="flex min-h-[44px] w-full items-center justify-between rounded-[3px] bg-pn-signal px-3.5 text-[14px] font-semibold text-white transition hover:brightness-110 active:translate-y-px"
          >
            <span className="flex items-center gap-2">
              <Plus size={17} aria-hidden /> Novo lead
            </span>
            <kbd className="rounded-[2px] bg-white/20 px-1.5 py-0.5 font-pn-mono text-[10.5px]">
              Ctrl K
            </kbd>
          </button>
          <div className="flex items-center justify-between px-1">
            <a
              href="https://www.phladev.com.br"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex min-h-[36px] items-center gap-1.5 text-[13px] text-pn-muted hover:text-pn-ink"
            >
              Ver site <ExternalLink size={13} aria-hidden />
            </a>
            <form action={signOutAction}>
              <button
                type="submit"
                className="inline-flex min-h-[36px] items-center gap-1.5 text-[13px] text-pn-muted hover:text-pn-ink"
              >
                <LogOut size={14} aria-hidden /> Sair
              </button>
            </form>
          </div>
        </div>
      </aside>

      {/* Barra superior (mobile) */}
      <header className="sticky top-0 z-30 flex h-14 items-center justify-between border-b border-pn-line bg-pn-paper/95 px-4 backdrop-blur lg:hidden">
        <p className="font-pn-display text-[22px] font-medium italic leading-none tracking-[-0.03em]">
          prospecção
        </p>
        {dueCount > 0 && (
          <Link
            href="/admin"
            className="rounded-[2px] bg-pn-signal px-2 py-1 font-pn-mono text-[11px] font-semibold text-white"
          >
            {dueCount} para hoje
          </Link>
        )}
      </header>

      <main
        id="conteudo"
        className="px-4 pb-32 pt-6 sm:px-8 lg:ml-[232px] lg:px-12 lg:pb-16 lg:pt-10"
      >
        <div className="mx-auto w-full max-w-[1100px]">{children}</div>
      </main>

      {/* Botão flutuante (mobile) */}
      <button
        type="button"
        onClick={() => setCapture(true)}
        aria-label="Novo lead"
        className="fixed bottom-[76px] right-4 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-pn-signal text-white shadow-[0_10px_24px_-8px_rgba(179,52,28,0.7)] transition active:scale-95 lg:hidden"
      >
        <Plus size={26} aria-hidden />
      </button>

      {/* Navegação inferior (mobile) */}
      <nav
        aria-label="Principal"
        className="fixed inset-x-0 bottom-0 z-30 grid grid-cols-5 border-t border-pn-line bg-pn-card/95 pb-[env(safe-area-inset-bottom)] backdrop-blur lg:hidden"
      >
        {mobileMain.map((item) => {
          const active = isActive(item)
          const Icon = item.icon
          return (
            <Link
              key={item.href}
              href={item.href}
              aria-current={active ? 'page' : undefined}
              className={cn(
                'relative flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-medium',
                active ? 'text-pn-ink' : 'text-pn-muted',
              )}
            >
              {active && (
                <span
                  aria-hidden
                  className="absolute inset-x-5 top-0 h-[3px] bg-pn-ink"
                />
              )}
              <Icon size={20} strokeWidth={active ? 2.25 : 1.75} aria-hidden />
              {item.label}
              {item.href === '/admin' && dueCount > 0 && (
                <span
                  className="absolute right-[22%] top-2 h-2 w-2 rounded-full bg-pn-signal"
                  aria-hidden
                />
              )}
            </Link>
          )
        })}
        <button
          type="button"
          onClick={() => setMore((v) => !v)}
          aria-expanded={more}
          aria-controls="mais-menu"
          className={cn(
            'relative flex min-h-[60px] flex-col items-center justify-center gap-1 text-[11px] font-medium',
            moreActive || more ? 'text-pn-ink' : 'text-pn-muted',
          )}
        >
          {moreActive && (
            <span
              aria-hidden
              className="absolute inset-x-5 top-0 h-[3px] bg-pn-ink"
            />
          )}
          {more ? (
            <X size={20} aria-hidden />
          ) : (
            <MoreHorizontal size={20} aria-hidden />
          )}
          Mais
        </button>
      </nav>

      {more && (
        <div
          id="mais-menu"
          className="fixed inset-x-3 bottom-[72px] z-40 rounded-[3px] border border-pn-ink/20 bg-pn-card p-2 shadow-[0_20px_50px_-20px_rgba(29,26,22,0.5)] lg:hidden"
        >
          {mobileMore.map((item) => {
            const Icon = item.icon
            return (
              <Link
                key={item.href}
                href={item.href}
                className="flex min-h-[48px] items-center gap-3 rounded-[3px] px-3 text-[15px] hover:bg-pn-sunk"
              >
                <Icon size={18} strokeWidth={1.75} aria-hidden /> {item.label}
              </Link>
            )
          })}
          <form action={signOutAction}>
            <button
              type="submit"
              className="flex min-h-[48px] w-full items-center gap-3 rounded-[3px] px-3 text-[15px] text-pn-muted hover:bg-pn-sunk"
            >
              <LogOut size={18} strokeWidth={1.75} aria-hidden /> Sair
            </button>
          </form>
        </div>
      )}

      <CaptureDialog open={capture} onClose={() => setCapture(false)} />
    </div>
  )
}
