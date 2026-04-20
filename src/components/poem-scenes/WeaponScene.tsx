'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useEffect, useRef, useState } from 'react'
import type { Poem } from '@/lib/poems'
import BackNav from '@/components/poem/BackNav'
import useScrollProgress from '@/hooks/useScrollProgress'

const SCAN_DEFS = [
  { id: 0, y: 18, dur: 7.5, delay: 0.0, w: 26, minP: 0.0, op: 0.16, rev: false },
  { id: 1, y: 76, dur: 9.2, delay: 3.4, w: 20, minP: 0.0, op: 0.13, rev: true },
  { id: 2, y: 42, dur: 3.8, delay: 0.7, w: 30, minP: 0.28, op: 0.22, rev: false },
  { id: 3, y: 89, dur: 4.1, delay: 1.8, w: 22, minP: 0.28, op: 0.18, rev: true },
  { id: 4, y: 12, dur: 2.2, delay: 0.3, w: 33, minP: 0.55, op: 0.26, rev: false },
  { id: 5, y: 58, dur: 1.9, delay: 0.9, w: 28, minP: 0.55, op: 0.24, rev: false },
  { id: 6, y: 32, dur: 2.6, delay: 1.3, w: 25, minP: 0.55, op: 0.2, rev: true },
  { id: 7, y: 93, dur: 2.0, delay: 0.4, w: 24, minP: 0.55, op: 0.18, rev: true },
  { id: 8, y: 50, dur: 1.1, delay: 0.1, w: 36, minP: 0.8, op: 0.3, rev: false },
  { id: 9, y: 66, dur: 1.0, delay: 0.5, w: 30, minP: 0.8, op: 0.28, rev: false },
  { id: 10, y: 25, dur: 1.4, delay: 0.6, w: 28, minP: 0.8, op: 0.24, rev: true },
  { id: 11, y: 82, dur: 1.2, delay: 0.2, w: 32, minP: 0.8, op: 0.22, rev: true },
]

function ScanLines({ progress }: { progress: number }) {
  return (
    <div className="fixed inset-0 pointer-events-none z-20" style={{ mixBlendMode: 'screen' }}>
      {SCAN_DEFS.map((s) => {
        const opacity = progress >= s.minP ? s.op * Math.min(1, (progress - s.minP) / 0.14) : 0
        const fromX = s.rev ? '100vw' : `-${s.w}vw`
        const toX = s.rev ? `-${s.w}vw` : '100vw'

        return (
          <motion.div
            key={s.id}
            style={{
              position: 'absolute',
              top: `${s.y}%`,
              height: '1.5px',
              width: `${s.w}vw`,
              background:
                'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.92) 50%, transparent 100%)',
              opacity,
            }}
            initial={{ x: fromX }}
            animate={{ x: toX }}
            transition={{
              duration: s.dur,
              delay: s.delay,
              repeat: Infinity,
              repeatType: 'loop',
              ease: 'linear',
            }}
          />
        )
      })}
    </div>
  )
}

function FinalBurst() {
  const ref = useRef<HTMLDivElement>(null)
  const [fired, setFired] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setFired(true)
      },
      { threshold: 0.45 }
    )

    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="absolute inset-0">
      {fired && (
        <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 30, mixBlendMode: 'screen' }}>
          {Array.from({ length: 20 }, (_, i) => (
            <motion.div
              key={i}
              style={{
                position: 'absolute',
                top: `${(i / 19) * 100}%`,
                height: '1px',
                width: '70vw',
                background: `linear-gradient(90deg, transparent, rgba(255,255,255,${0.35 + (i % 5) * 0.08}) 50%, transparent)`,
              }}
              initial={{ x: '-70vw', opacity: 1 }}
              animate={{ x: '100vw', opacity: 0 }}
              transition={{ duration: 0.5, delay: i * 0.022, ease: 'easeIn' }}
            />
          ))}
        </div>
      )}
    </div>
  )
}

function GrindDivider() {
  return (
    <div className="flex justify-center py-10">
      <motion.div
        style={{ height: '0.5px', background: 'rgba(232,228,222,0.12)' }}
        initial={{ width: 0 }}
        whileInView={{ width: 200 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5, ease: 'linear' }}
      />
    </div>
  )
}

export default function WeaponScene({ poem }: { poem: Poem }) {
  const segments = poem.content.trim().split(/\n\n+/)
  const progress = useScrollProgress()

  const bgR = Math.round(7 + progress * 9)
  const bgG = Math.round(7 - progress * 3)
  const bgB = Math.round(12 - progress * 8)

  return (
    <main className="relative text-[#e8e4de]" style={{ background: `rgb(${bgR},${bgG},${bgB})` }}>
      <BackNav />
      <ScanLines progress={progress} />

      <div className="relative z-10">
        <div className="min-h-screen flex flex-col justify-center px-8 md:px-16 max-w-[520px] mx-auto">
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.35 }}
            transition={{ delay: 0.4, duration: 1 }}
            className="text-[11px] tracking-[0.5em] mb-6"
          >
            {new Date(poem.date).getFullYear()} · {poem.mood}
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
            className="poem-title font-serif text-4xl md:text-5xl leading-snug"
          >
            {poem.title}
          </motion.h1>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.22 }}
            transition={{ delay: 1.4, duration: 0.8 }}
            className="mt-12 text-[10px] tracking-[0.55em]"
          >
            scroll
          </motion.p>
        </div>

        <div className="max-w-[480px] mx-auto px-8">
          {segments.map((seg, i) => {
            const trimmed = seg.trim()
            if (trimmed === '—') return <GrindDivider key={i} />

            const isVoid = trimmed === '내부'
            const isFinal = i === segments.length - 1

            return (
              <section
                key={i}
                className={`relative flex ${
                  isVoid ? 'items-start pt-20 min-h-[105vh]' : 'items-center min-h-[52vh]'
                }`}
              >
                {isFinal && <FinalBurst />}

                <motion.div
                  initial={{ opacity: 0 }}
                  whileInView={{ opacity: 1 }}
                  viewport={{ once: true, margin: '-60px' }}
                  transition={{ duration: 0.7, ease: 'easeOut' }}
                >
                  {trimmed.split('\n').filter(Boolean).map((line, j) => (
                    <motion.p
                      key={j}
                      initial={{ opacity: 0, y: 5 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.55, delay: j * 0.1 }}
                      className="poem-text font-serif text-[1.15rem] leading-[2.4] text-[#e8e4de]"
                    >
                      {line}
                    </motion.p>
                  ))}
                </motion.div>
              </section>
            )
          })}
        </div>

        <div className="min-h-[40vh] flex flex-col justify-center items-center pb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 1 }}
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