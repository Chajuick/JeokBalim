import type { Metadata } from 'next'
import { Noto_Serif_KR } from 'next/font/google'
import './globals.css'

const notoSerifKR = Noto_Serif_KR({
  weight: ['300', '400', '500'],
  subsets: ['latin'],
  variable: '--font-noto-serif-kr',
  display: 'swap',
})

export const metadata: Metadata = {
  title: '적바림',
  description: '짧고 선명한 시들. 적바림.',
  keywords: ['시', '시집', '한국시', '현대시', '적바림'],
  authors: [{ name: '적바림' }],
  openGraph: {
    title: '적바림',
    description: '짧고 선명한 시들. 적바림.',
    url: 'https://jeok-balim.vercel.app',
    siteName: '적바림',
    locale: 'ko_KR',
    type: 'website',
  },
  twitter: {
    card: 'summary',
    title: '적바림',
    description: '짧고 선명한 시들. 적바림.',
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ko" className={notoSerifKR.variable} data-scroll-behavior="smooth">
      <body>{children}</body>
    </html>
  )
}
