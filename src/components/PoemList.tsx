'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import type { PoemMeta } from '@/lib/poems'

const moodAccent: Record<string, string> = {
  성찰: '#b8a9d9',
  위로: '#8fb3d9',
  그리움: '#d9bc8a',
  사랑: '#d4cfa0',
}

export default function PoemList({ poems }: { poems: PoemMeta[] }) {
  return (
    <main className="min-h-screen bg-[#0c0b0a] text-[#f0ede8] selection:bg-white/10">
      <header className="pt-20 pb-12 px-8 md:px-16 lg:px-24">
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 0.36 }}
          transition={{ duration: 1.2 }}
          className="text-xs tracking-[0.5em] font-light"
        >
          적바림
        </motion.p>
      </header>

      <section className="px-8 md:px-16 lg:px-24 pb-40">
        {poems.map((poem, i) => (
          <PoemEntry key={poem.slug} poem={poem} index={i} />
        ))}
      </section>

      <footer className="px-8 md:px-16 lg:px-24 pb-16">
        <p className="text-xs opacity-20 tracking-widest">{poems.length}편</p>
      </footer>
    </main>
  )
}

function PoemEntry({ poem, index }: { poem: PoemMeta; index: number }) {
  const [hovered, setHovered] = useState(false)
  const accent = moodAccent[poem.mood] || '#f0ede8'

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/poem/${poem.slug}`}
        className="block py-14 border-b border-white/[0.06] cursor-pointer"
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
      >
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[11px] tracking-[0.35em] opacity-40">
            {new Date(poem.date).getFullYear()}
          </span>
          <span className="text-[11px] tracking-[0.3em] opacity-40">{poem.mood}</span>
        </div>

        <h2
          className="font-serif leading-[1.15] transition-colors duration-700"
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            color: hovered ? accent : '#f0ede8',
          }}
        >
          {poem.title}
        </h2>

        <motion.p
          animate={{ opacity: hovered ? 0.35 : 0, y: hovered ? 0 : 6 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="mt-4 font-serif text-sm leading-relaxed"
        >
          {poem.preview}
        </motion.p>
      </Link>
    </motion.div>
  )
}
