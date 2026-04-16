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
  description: '시집',
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
