import type { Metadata } from 'next'
import {
  Inter,
  Space_Grotesk as SpaceGrotesk,
  JetBrains_Mono as JetBrainsMono,
} from 'next/font/google'
import './globals.css'
import { Toaster } from 'react-hot-toast'

const inter = Inter({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-inter',
  display: 'swap',
})

const spaceGrotesk = SpaceGrotesk({
  subsets: ['latin'],
  weight: ['500', '600'],
  variable: '--font-space-grotesk',
  display: 'swap',
})

const jetBrainsMono = JetBrainsMono({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-jetbrains-mono',
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
    <html
      lang="en"
      className={`scroll-smooth ${inter.variable} ${spaceGrotesk.variable} ${jetBrainsMono.variable}`}
    >
      <head>
        <link
          rel="icon"
          href="/icon.svg"
          type="image/<generated>"
          sizes="<generated>"
        />
        <meta
          property="og:title"
          content="Pedro Henrique - Desenvolvedor Fullstack"
        />
        <meta
          property="og:description"
          content="Desenvolvedor Fullstack com experiência em criar soluções completas e eficientes utilizando tecnologias modernas como React, Node.js, TypeScript e Next.js. Explore meus projetos e entre em contato para colaborar em novas oportunidades."
        />
        <meta property="og:url" content="https://phladev.vercel.app" />
        <meta
          property="og:image"
          content="https://res.cloudinary.com/dxsut9uov/image/upload/v1727067579/image-link.svg"
          itemProp="image"
        />
      </head>
      <body className={`${inter.className} bg-canvas antialiased`}>
        <Toaster />
        {children}
      </body>
    </html>
  )
}
