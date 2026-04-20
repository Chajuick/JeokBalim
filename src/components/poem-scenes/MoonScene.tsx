'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import type { Poem } from '@/lib/poems'
import BackNav from '@/components/poem/BackNav'
import StanzaBlock from '@/components/poem/StanzaBlock'
import useScrollProgress from '@/hooks/useScrollProgress'

type Star = {
  id: number
  x: number
  y: number
  size: number
  delay: number
  duration: number
}

function MoonStars() {
  const [stars] = useState<Star[]>(() =>
    Array.from({ length: 55 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 65,
      size: 0.6 + Math.random() * 1.6,
      delay: Math.random() * 5,
      duration: 2.5 + Math.random() * 4,
    }))
  )

  return (
    <div className="fixed inset-0 pointer-events-none z-0">
      {stars.map((s) => (
        <motion.div
          key={s.id}
          className="absolute rounded-full"
          style={{
            left: `${s.x}%`,
            top: `${s.y}%`,
            width: s.size,
            height: s.size,
            background: 'rgba(240,235,220,0.8)',
          }}
          animate={{ opacity: [0.2, 0.9, 0.35, 0.75, 0.2] }}
          transition={{
            duration: s.duration,
            delay: s.delay,
            repeat: Infinity,
            ease: 'easeInOut',
          }}
        />
      ))}
    </div>
  )
}

const CITY_BUILDINGS: [number, number, number, boolean][] = [
  [0, 196, 34, false],
  [36, 142, 26, true],
  [64, 170, 40, false],
  [106, 154, 20, false],
  [128, 115, 34, true],
  [164, 180, 28, false],
  [194, 148, 22, false],
  [218, 82, 46, true],
  [266, 163, 20, false],
  [288, 130, 32, false],
  [322, 172, 20, false],
  [344, 96, 42, true],
  [388, 160, 28, false],
  [418, 64, 52, true],
  [472, 152, 22, false],
  [496, 122, 36, false],
  [534, 168, 18, false],
  [554, 90, 44, true],
  [600, 158, 22, false],
  [624, 134, 32, false],
  [658, 178, 24, false],
  [684, 78, 42, true],
  [728, 148, 26, false],
  [756, 168, 20, false],
  [778, 103, 46, true],
  [826, 153, 30, false],
  [858, 128, 32, false],
  [892, 170, 26, false],
  [920, 148, 30, false],
  [952, 188, 50, false],
]

function CitySkyline({ glow }: { glow: number }) {
  const VIEW_H = 270
  const COLORS = ['#050c18', '#06101c', '#07111e', '#050d17', '#060f1a', '#07121f']

  return (
    <div className="w-full">
      <svg
        viewBox="0 0 1000 270"
        preserveAspectRatio="xMidYMax slice"
        style={{ width: '100%', height: '230px', display: 'block' }}
      >
        <ellipse cx="500" cy="266" rx="500" ry="52" fill={`rgba(55,30,8,${glow * 1.1})`} />

        {CITY_BUILDINGS.map(([bx, top, bw, hasAntenna], i) => (
          <g key={i}>
            <rect x={bx} y={top} width={bw} height={VIEW_H - top} fill={COLORS[i % COLORS.length]} />
            {hasAntenna && (
              <rect
                x={bx + Math.floor(bw / 2) - 2}
                y={top - 14}
                width={4}
                height={16}
                fill={COLORS[(i + 2) % COLORS.length]}
              />
            )}
          </g>
        ))}

        {CITY_BUILDINGS.flatMap(([bx, top, bw], bi) => {
          const rows = Math.floor((VIEW_H - top - 26) / 19)
          const cols = Math.max(1, Math.floor((bw - 6) / 12))
          const wins = []

          for (let r = 0; r < rows; r++) {
            for (let c = 0; c < cols; c++) {
              const h = (bi * 31 + r * 13 + c * 7) % 10
              if (h < 7) {
                wins.push(
                  <rect
                    key={`${bi}-${r}-${c}`}
                    x={bx + 4 + c * 12}
                    y={top + 20 + r * 19}
                    width={5}
                    height={7}
                    fill={`rgba(255,210,100,${0.06 + (h % 4) * 0.055 + glow * 0.30})`}
                  />
                )
              }
            }
          }

          return wins
        })}

        <rect x="0" y="267" width="1000" height="6" fill="#03060d" />
      </svg>
    </div>
  )
}

export default function MoonScene({ poem }: { poem: Poem }) {
  const stanzas = poem.content.trim().split(/\n\n+/)
  const progress = useScrollProgress()
  const MOON = 175

  const r = MOON / 2
  const terminatorRx = Math.abs(r * (1 - 2 * progress))
  const isGibbous = progress < 0.5
  const moonGlow = 0.18 - progress * 0.14
  const cityGlow = Math.pow(Math.max(0, progress - 0.6) / 0.4, 1.5)

  return (
    <main className="relative bg-[#04090f] text-[#f0ede8]">
      <BackNav />
      <MoonStars />

      <div
        className="fixed pointer-events-none z-10"
        style={{ top: '7vh', right: '7vw', width: MOON, height: MOON }}
      >
        <svg width={MOON} height={MOON} style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="moon-rg" cx="38%" cy="34%">
              <stop offset="0%" stopColor="rgba(255,252,210,0.72)" />
              <stop offset="45%" stopColor="rgba(248,228,130,0.60)" />
              <stop offset="100%" stopColor="rgba(228,198,80,0.44)" />
            </radialGradient>

            <filter id="mglow" x="-100%" y="-100%" width="300%" height="300%">
              <feGaussianBlur stdDeviation="24" />
            </filter>

            <mask id="mphase">
              <circle cx={r} cy={r} r={r} fill="white" />
              <rect x={r} y={0} width={r} height={MOON} fill="black" />
              <ellipse cx={r} cy={r} rx={terminatorRx} ry={r} fill={isGibbous ? 'white' : 'black'} />
            </mask>
          </defs>

          <circle
            cx={r}
            cy={r}
            r={r}
            fill={`rgba(248,220,100,${moonGlow * 3})`}
            filter="url(#mglow)"
            mask="url(#mphase)"
          />

          <circle cx={r} cy={r} r={r} fill="url(#moon-rg)" mask="url(#mphase)" />
        </svg>
      </div>

      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none z-0"
        style={{
          height: '40vh',
          background: `linear-gradient(to top, rgba(45,22,5,${cityGlow * 0.7}) 0%, transparent 100%)`,
        }}
      />

      <div className="relative z-10">
        <div className="min-h-screen flex flex-col justify-center px-8 md:px-16 lg:px-24">
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
          {stanzas.map((stanza, i) => (
            <section key={i} className="min-h-[55vh] flex items-center">
              <StanzaBlock stanza={stanza} />
            </section>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, margin: '-60px' }}
          transition={{ duration: 1.8 }}
          className="relative"
        >
          <CitySkyline glow={cityGlow} />

          <div className="absolute bottom-6 left-1/2 -translate-x-1/2">
            <Link
              href="/"
              className="text-[11px] tracking-[0.4em] opacity-22 hover:opacity-55 transition-opacity duration-300"
            >
              ← 목록
            </Link>
          </div>
        </motion.div>
      </div>
    </main>
  )
}