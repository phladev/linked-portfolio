import Script from 'next/script'
import Header from '@/components/header'

export default function SiteLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <>
      <Script
        src="https://www.googletagmanager.com/gtag/js?id=G-50BQQC2QER"
        strategy="afterInteractive"
      />
      <Script id="google-analytics" strategy="afterInteractive">
        {`
          window.dataLayer = window.dataLayer || [];
          function gtag(){dataLayer.push(arguments);}
          gtag('js', new Date());
          gtag('config', 'G-50BQQC2QER');
        `}
      </Script>
      <Header />
      {children}
    </>
  )
}
