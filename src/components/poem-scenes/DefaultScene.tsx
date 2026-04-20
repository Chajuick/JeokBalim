'use client'

import Link from 'next/link'
import type { Poem } from '@/lib/poems'
import BackNav from '@/components/poem/BackNav'
import StanzaBlock from '@/components/poem/StanzaBlock'

export default function DefaultScene({ poem }: { poem: Poem }) {
  const stanzas = poem.content.trim().split(/\n\n+/)

  return (
    <main className="relative bg-[#0c0b0a] text-[#f0ede8]">
      <BackNav />

      <div className="max-w-[480px] mx-auto px-8">
        <div className="min-h-screen flex flex-col justify-center">
          <p className="text-[11px] tracking-[0.5em] opacity-28 mb-6">
            {new Date(poem.date).getFullYear()} · {poem.mood}
          </p>
          <h1 className="poem-title font-serif text-4xl leading-snug mb-16">
            {poem.title}
          </h1>
        </div>

        {stanzas.map((stanza, i) => (
          <section key={i} className="min-h-[50vh] flex items-center">
            <StanzaBlock stanza={stanza} />
          </section>
        ))}

        <div className="min-h-[30vh] flex items-center pb-16">
          <Link
            href="/"
            className="text-[11px] tracking-[0.4em] opacity-22 hover:opacity-55 transition-opacity"
          >
            ← 목록
          </Link>
        </div>
      </div>
    </main>
  )
}