import type { Metadata } from 'next'
import { redirect } from 'next/navigation'
import { Figtree, Fraunces, Geist_Mono as GeistMono } from 'next/font/google'
import { auth, signOut } from '@/lib/auth'
import { getDemos, getDueCount, getTemplates } from '@/lib/db/queries/leads'
import { SendDemoProvider } from '@/components/painel/send-demo'
import { Shell } from '@/components/painel/shell'
import '../painel.css'

const display = Fraunces({
  subsets: ['latin'],
  axes: ['opsz'],
  style: ['normal', 'italic'],
  variable: '--font-pn-display',
  display: 'swap',
})

const body = Figtree({
  subsets: ['latin'],
  variable: '--font-pn-body',
  display: 'swap',
})

const mono = GeistMono({
  subsets: ['latin'],
  variable: '--font-pn-mono',
  display: 'swap',
  adjustFontFallback: false,
})

export const metadata: Metadata = {
  title: { default: 'Prospecção', template: '%s | Prospecção' },
  robots: { index: false, follow: false },
}

async function signOutAction() {
  'use server'
  await signOut({ redirectTo: '/admin/login' })
}

export default async function PainelLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const session = await auth()
  if (!session?.user) redirect('/admin/login')

  const [dueCount, demos, templates] = await Promise.all([
    getDueCount(),
    getDemos(),
    getTemplates(),
  ])

  return (
    <div className={`${display.variable} ${body.variable} ${mono.variable}`}>
      <SendDemoProvider demos={demos} templates={templates}>
        <Shell dueCount={dueCount} signOutAction={signOutAction}>
          {children}
        </Shell>
      </SendDemoProvider>
    </div>
  )
}
