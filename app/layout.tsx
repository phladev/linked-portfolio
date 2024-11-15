import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import Header from '@/components/header'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Pedro Henrique - Desenvolvedor Fullstack',
  description:
    'Desenvolvedor Fullstack com experiência em criar soluções completas e eficientes utilizando tecnologias modernas como React, Node.js, TypeScript e Next.js. Explore meus projetos e entre em contato para colaborar em novas oportunidades.',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link
          rel="icon"
          href="/icon.svg"
          type="image/<generated>"
          sizes="<generated>"
        />
      </head>
      <body className={`${inter.className} bg-[#171C28] antialiased`}>
        <Toaster />
        <Header />
        {children}
      </body>
    </html>
  )
}
