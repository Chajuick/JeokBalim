'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import type { Poem } from '@/lib/poems'
import BackNav from '@/components/poem/BackNav'
import StanzaBlock from '@/components/poem/StanzaBlock'
import useScrollProgress from '@/hooks/useScrollProgress'

type RainDrop = {
  id: number
  x: number
  delay: number
  duration: number
  height: number
  opacity: number
}

export default function RainScene({ poem }: { poem: Poem }) {
  const stanzas = poem.content.trim().split(/\n\n+/)
  const progress = useScrollProgress()

  const [light] = useState<RainDrop[]>(() =>
    Array.from({ length: 45 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 3,
      duration: 0.55 + Math.random() * 0.7,
      height: 10 + Math.random() * 16,
      opacity: 0.12 + Math.random() * 0.18,
    }))
  )

  const [heavy] = useState<RainDrop[]>(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      delay: Math.random() * 2.5,
      duration: 0.7 + Math.random() * 0.8,
      height: 18 + Math.random() * 28,
      opacity: 0.25 + Math.random() * 0.3,
    }))
  )

  const lightAlpha = 0.22 + progress * 0.35
  const heavyAlpha = Math.pow(Math.max(0, (progress - 0.18) / 0.82), 1.4)

  return (
    <main className="relative bg-[#080d14] text-[#f0ede8]">
      <BackNav />

      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(20,55,130,${0.10 + progress * 0.18}) 0%, transparent 70%)`,
        }}
      />

      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ opacity: lightAlpha }}
      >
        {light.map((d) => (
          <motion.div
            key={d.id}
            className="absolute"
            style={{
              left: `${d.x}%`,
              top: '-2%',
              width: '1px',
              height: `${d.height}px`,
              background: `rgba(170,210,245,${d.opacity})`,
            }}
            animate={{ y: '104vh' }}
            transition={{
              duration: d.duration,
              delay: d.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div
        className="fixed inset-0 pointer-events-none z-0 overflow-hidden"
        style={{ opacity: heavyAlpha }}
      >
        {heavy.map((d) => (
          <motion.div
            key={d.id}
            className="absolute"
            style={{
              left: `${d.x}%`,
              top: '-2%',
              width: '1.5px',
              height: `${d.height}px`,
              background: `rgba(140,190,235,${d.opacity})`,
            }}
            animate={{ y: '104vh' }}
            transition={{
              duration: d.duration,
              delay: d.delay,
              repeat: Infinity,
              ease: 'linear',
            }}
          />
        ))}
      </div>

      <div className="relative z-10">
        <div className="min-h-screen flex flex-col justify-center items-center text-center px-8">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.44 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-[11px] tracking-[0.5em] mb-6"
          >
            {new Date(poem.date).getFullYear()} · {poem.mood}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}
            className="poem-title font-serif text-4xl md:text-5xl leading-snug"
          >
            {poem.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.28 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-12 text-[10px] tracking-[0.55em]"
          >
            scroll
          </motion.p>
        </div>

        <div className="max-w-[480px] mx-auto px-8">
          {stanzas.map((stanza, i) => {
            const isLast = i === stanzas.length - 1

            return (
              <section key={i} className="min-h-[65vh] flex items-center">
                <StanzaBlock
                  stanza={stanza}
                  align={isLast ? 'center' : 'left'}
                  className={isLast ? 'w-full' : ''}
                />
              </section>
            )
          })}
        </div>

        <div className="min-h-[40vh] flex flex-col justify-center items-center pb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1.5 }}
            className="text-center"
          >
            <Link
              href="/"
              className="text-[11px] tracking-[0.4em] opacity-22 hover:opacity-55 transition-opacity duration-300"
            >
              ← 목록
            </Link>
          </motion.div>
        </div>
      </div>
    </main>
  )
}