'use client'

import Link from 'next/link'

export default function BackNav() {
  return (
    <Link
      href="/"
      className="fixed top-8 left-8 text-[11px] tracking-[0.4em] opacity-22 hover:opacity-55 transition-opacity duration-300 z-50"
    >
      ← 적바림
    </Link>
  )
}