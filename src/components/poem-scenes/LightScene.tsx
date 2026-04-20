'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Poem } from '@/lib/poems'
import BackNav from '@/components/poem/BackNav'
import StanzaBlock from '@/components/poem/StanzaBlock'
import useScrollProgress from '@/hooks/useScrollProgress'

export default function LightScene({ poem }: { poem: Poem }) {
  const stanzas = poem.content.trim().split(/\n\n+/)
  const progress = useScrollProgress()

  const lightSize = 100 - progress * 78
  const lightOpacity = 0.9 - progress * 0.78
  const lightY = progress * -10

  const beamOpacity = Math.max(0, 0.42 - progress * 0.34)
  const vignetteOpacity = 0.22 + progress * 0.42
  const bgTop = 10 - progress * 4
  const bgMid = 12 - progress * 2
  const bgBottom = 18 + progress * 8

  return (
    <main
      className="relative text-[#f0ede8]"
      style={{
        background: `linear-gradient(
          to bottom,
          rgb(${bgTop}, ${bgTop}, ${bgMid}) 0%,
          rgb(8, 8, 16) 38%,
          rgb(6, 6, ${bgBottom}) 100%
        )`,
      }}
    >
      <BackNav />

      {/* 전체 빛 레이어 */}
      <div className="fixed inset-0 pointer-events-none z-0">
        {/* 세로 빛기둥 */}
        <div
          style={{
            position: 'absolute',
            top: '-6%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '42vw',
            minWidth: '280px',
            maxWidth: '720px',
            height: '78vh',
            opacity: beamOpacity,
            background:
              'linear-gradient(to bottom, rgba(255,235,160,0.22) 0%, rgba(255,220,120,0.11) 28%, rgba(180,140,60,0.04) 58%, transparent 100%)',
            filter: 'blur(18px)',
          }}
        />

        {/* 중심 광원 */}
        <div
          style={{
            position: 'absolute',
            top: `${lightY}%`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${lightSize}%`,
            height: '62%',
            opacity: lightOpacity,
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(255,236,150,0.46) 0%, rgba(245,200,90,0.18) 30%, rgba(180,140,40,0.06) 58%, transparent 82%)',
            filter: 'blur(8px)',
            transition: 'width 0.08s linear, opacity 0.08s linear',
          }}
        />

        {/* 가장자리 암부 */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            background: `radial-gradient(circle at center, transparent 0%, transparent 34%, rgba(0,0,0,${vignetteOpacity * 0.18}) 68%, rgba(0,0,0,${vignetteOpacity * 0.55}) 100%)`,
          }}
        />
      </div>

      <div className="relative z-10">
        {/* 타이틀 */}
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
            style={{
              textShadow: '0 0 28px rgba(255,236,180,0.08)',
            }}
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

        {/* 본문 */}
        <div className="max-w-[480px] mx-auto px-8">
          {stanzas.map((stanza, i) => {
            const localFade = Math.min(1, progress * 1.1)
            const textOpacity = Math.max(0.7, 1 - i * 0.035 - localFade * 0.08)

            return (
              <section
                key={i}
                className="min-h-[62vh] flex items-center"
                style={{ opacity: textOpacity }}
              >
                <StanzaBlock
                  stanza={stanza}
                  textShadow="0 0 20px rgba(6,6,12,0.98), 0 0 48px rgba(6,6,12,0.86), 0 1px 2px rgba(0,0,0,0.9)"
                />
              </section>
            )
          })}
        </div>

        {/* 마지막 */}
        <div className="min-h-[52vh] flex flex-col justify-center items-center pb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2 }}
            className="text-center"
          >
            <div
              style={{
                width: '5px',
                height: '5px',
                borderRadius: '50%',
                background: 'rgba(232,220,190,0.72)',
                margin: '0 auto 40px',
                boxShadow: '0 0 24px 10px rgba(232,220,190,0.14)',
              }}
            />
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