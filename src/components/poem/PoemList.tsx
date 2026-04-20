'use client'

import { motion } from 'framer-motion'
import type { PoemMeta } from '@/lib/poems'
import PoemListEntry from './PoemListEntry'

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
          <PoemListEntry key={poem.slug} poem={poem} index={i} />
        ))}
      </section>

      <footer className="px-8 md:px-16 lg:px-24 pb-16">
        <p className="text-xs opacity-20 tracking-widest">{poems.length}편</p>
      </footer>
    </main>
  )
}