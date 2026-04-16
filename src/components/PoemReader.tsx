'use client'

import { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Poem } from '@/lib/poems'

// ─── Scene router ─────────────────────────────────────────────
export default function PoemReader({ poem }: { poem: Poem }) {
  if (poem.slug === '001') return <LightScene poem={poem} />
  if (poem.slug === '002') return <RainScene poem={poem} />
  if (poem.slug === '003') return <SteamScene poem={poem} />
  return <DefaultScene poem={poem} />
}

// ─── Shared stanza block ───────────────────────────────────────
function StanzaBlock({
  stanza,
  align = 'left',
  className = '',
  textShadow,
}: {
  stanza: string
  align?: 'left' | 'center'
  className?: string
  textShadow?: string
}) {
  const lines = stanza.split('\n').filter(Boolean)
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, ease: [0.22, 1, 0.36, 1] }}
      className={className}
      style={{ textAlign: align }}
    >
      {lines.map((line, i) => (
        <motion.p
          key={i}
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: i * 0.09 }}
          className="font-serif text-[1.15rem] leading-[2.4] text-[#e8e4de]"
          style={textShadow ? { textShadow } : undefined}
        >
          {line}
        </motion.p>
      ))}
    </motion.div>
  )
}

// ─── Back nav ──────────────────────────────────────────────────
function BackNav() {
  return (
    <Link
      href="/"
      className="fixed top-8 left-8 text-[11px] tracking-[0.4em] opacity-22 hover:opacity-55 transition-opacity duration-300 z-50"
    >
      ← 적바림
    </Link>
  )
}

// ─── 001 빛의 자리 · LightScene ───────────────────────────────
// 위에서 내리쬐는 빛 → 스크롤 내릴수록 빛이 멀어지고 어둠 속으로
function LightScene({ poem }: { poem: Poem }) {
  const stanzas = poem.content.trim().split(/\n\n+/)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      setProgress(el.scrollTop / (el.scrollHeight - el.clientHeight) || 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Light beam shrinks and fades as you scroll down
  const lightSize = 100 - progress * 82           // 100% → 18%
  const lightOpacity = 0.65 - progress * 0.55     // 0.65 → 0.10
  const lightY = progress * -18                    // slight upward drift

  return (
    <main className="relative bg-[#080810] text-[#f0ede8]">
      <BackNav />

      {/* Fixed light source — shrinks as you descend */}
      <div
        className="fixed top-0 left-0 right-0 pointer-events-none z-0 transition-none"
        style={{ height: '100vh' }}
      >
        <div
          style={{
            position: 'absolute',
            top: `${lightY}%`,
            left: '50%',
            transform: 'translateX(-50%)',
            width: `${lightSize}%`,
            height: '60%',
            background:
              'radial-gradient(ellipse at 50% 0%, rgba(255,230,100,0.28) 0%, rgba(240,190,60,0.10) 35%, rgba(180,140,40,0.03) 60%, transparent 80%)',
            transition: 'width 0.08s linear, opacity 0.08s linear',
            opacity: lightOpacity,
          }}
        />
      </div>

      {/* Scroll content */}
      <div className="relative z-10">
        {/* Title — sits in the light */}
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
            className="font-serif text-4xl md:text-5xl leading-snug"
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

        {/* Stanzas — each in its own section, descending into darkness */}
        <div className="max-w-[480px] mx-auto px-8">
          {stanzas.map((stanza, i) => {
            // subtle dimming — stays readable even in the deep dark
            const textOpacity = Math.max(0.72, 0.96 - i * 0.03)
            return (
              <section
                key={i}
                className="min-h-[60vh] flex items-center"
                style={{ opacity: textOpacity }}
              >
                <StanzaBlock
                  stanza={stanza}
                  textShadow="0 0 18px rgba(8,8,16,0.95), 0 0 40px rgba(8,8,16,0.8), 0 1px 2px rgba(8,8,16,1)"
                />
              </section>
            )
          })}
        </div>

        {/* Final — just a distant glow in the dark */}
        <div className="min-h-[50vh] flex flex-col justify-center items-center pb-32">
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 2 }}
            className="text-center"
          >
            <div
              style={{
                width: '4px',
                height: '4px',
                borderRadius: '50%',
                background: 'rgba(220,210,180,0.6)',
                margin: '0 auto 40px',
                boxShadow: '0 0 20px 8px rgba(220,210,180,0.12)',
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

// ─── 002 와라 · RainScene ─────────────────────────────────────
type RainDrop = { id: number; x: number; delay: number; duration: number; height: number; opacity: number }

function RainScene({ poem }: { poem: Poem }) {
  const stanzas = poem.content.trim().split(/\n\n+/)
  const [light, setLight] = useState<RainDrop[]>([])   // 가벼운 빗줄기
  const [heavy, setHeavy] = useState<RainDrop[]>([])   // 굵은 빗줄기
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    // 레이어 1 — 가늘고 빠른 빗줄기
    setLight(
      Array.from({ length: 45 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 3,
        duration: 0.55 + Math.random() * 0.7,
        height: 10 + Math.random() * 16,
        opacity: 0.12 + Math.random() * 0.18,
      }))
    )
    // 레이어 2 — 굵고 무거운 빗줄기
    setHeavy(
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 2.5,
        duration: 0.7 + Math.random() * 0.8,
        height: 18 + Math.random() * 28,
        opacity: 0.25 + Math.random() * 0.3,
      }))
    )
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      setProgress(el.scrollTop / (el.scrollHeight - el.clientHeight) || 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 가벼운 비: 처음엔 연하게, 조금씩 진해짐
  const lightAlpha = 0.22 + progress * 0.35            // 0.22 → 0.57
  // 굵은 비: 20% 지점부터 등장, 끝으로 갈수록 가득
  const heavyAlpha = Math.pow(Math.max(0, (progress - 0.18) / 0.82), 1.4)  // 0 → 1.0

  return (
    <main className="relative bg-[#080d14] text-[#f0ede8]">
      <BackNav />

      {/* 파란 틴트 — 점점 짙어짐 */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(ellipse at 50% 0%, rgba(20,55,130,${0.10 + progress * 0.18}) 0%, transparent 70%)`,
        }}
      />

      {/* 레이어 1 — 가벼운 빗줄기 */}
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
            transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      {/* 레이어 2 — 굵고 무거운 빗줄기 */}
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
            transition={{ duration: d.duration, delay: d.delay, repeat: Infinity, ease: 'linear' }}
          />
        ))}
      </div>

      {/* Scroll content */}
      <div className="relative z-10">
        {/* Title */}
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
            className="font-serif text-4xl md:text-5xl leading-snug"
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

        {/* Stanzas — emerge through the rain */}
        <div className="max-w-[480px] mx-auto px-8">
          {stanzas.map((stanza, i) => {
            // "와라" — the last stanza emerges clearly as rain lets up
            const isLast = i === stanzas.length - 1
            return (
              <section
                key={i}
                className="min-h-[65vh] flex items-center"
              >
                <StanzaBlock
                  stanza={stanza}
                  align={isLast ? 'center' : 'left'}
                  className={isLast ? 'w-full' : ''}
                />
              </section>
            )
          })}
        </div>

        {/* End */}
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

// ─── 003 슴슴하게 두었더라면 · SteamScene ─────────────────────
// 국밥 그릇 위로 피어오르는 연기 속을 스크롤로 헤쳐나가며
type SteamWisp = { id: number; x: number; delay: number; duration: number; size: number; drift: number }

function GukbapBowl() {
  return (
    <svg viewBox="0 0 240 130" width="240" height="130" style={{ opacity: 0.45 }}>
      {/* Bowl body */}
      <path
        d="M 25 45 Q 15 95 30 112 Q 55 126 120 126 Q 185 126 210 112 Q 225 95 215 45"
        fill="rgba(120,80,25,0.2)"
        stroke="rgba(200,155,70,0.5)"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
      {/* Rim ellipse */}
      <ellipse
        cx="120" cy="45" rx="95" ry="22"
        fill="rgba(100,65,20,0.15)"
        stroke="rgba(200,155,70,0.55)"
        strokeWidth="1.5"
      />
      {/* Soup surface */}
      <ellipse
        cx="120" cy="45" rx="80" ry="16"
        fill="rgba(160,110,40,0.18)"
      />
      {/* Surface reflection */}
      <ellipse
        cx="105" cy="41" rx="28" ry="5"
        fill="rgba(220,180,100,0.08)"
      />
    </svg>
  )
}

function SteamScene({ poem }: { poem: Poem }) {
  const stanzas = poem.content.trim().split(/\n\n+/)
  const [wisps, setWisps] = useState<SteamWisp[]>([])
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    setWisps(
      Array.from({ length: 10 }, (_, i) => ({
        id: i,
        x: 42 + Math.random() * 16,       // 국밥 그릇 중심
        delay: Math.random() * 14,         // 넓은 딜레이 → 듬성듬성
        duration: 8 + Math.random() * 7,   // 천천히
        size: 18 + Math.random() * 22,     // 적당한 크기
        drift: (Math.random() - 0.5) * 36,
      }))
    )
  }, [])

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      setProgress(el.scrollTop / (el.scrollHeight - el.clientHeight) || 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  const warmth = Math.pow(progress, 1.8) * 0.4

  return (
    <main className="relative bg-[#0d0a06] text-[#f0ede8]">
      <BackNav />

      {/* SVG turbulence — 유기적 연기 형태 */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="steam-turbulence" x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.02 0.012"
              numOctaves="4"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="12"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* 따뜻한 배경 — 스크롤 내릴수록 */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{ background: `linear-gradient(to top, rgba(130,80,18,${warmth}) 0%, transparent 55%)` }}
      />

      {/* Scroll content */}
      <div className="relative z-10">
        {/* Title */}
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
            className="font-serif text-4xl md:text-5xl leading-snug"
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

        {/* Stanzas — each in 70vh breathing space */}
        <div className="max-w-[480px] mx-auto px-8">
          {stanzas.map((stanza, i) => (
            <section key={i} className="min-h-[70vh] flex items-center">
              <StanzaBlock
                stanza={stanza}
                textShadow="0 0 24px rgba(13,10,6,0.98), 0 0 50px rgba(13,10,6,0.9), 0 2px 4px rgba(13,10,6,1)"
              />
            </section>
          ))}
        </div>

        {/* The bowl — steam rises from inside */}
        <div className="min-h-[60vh] flex flex-col justify-end items-center pb-20 px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center gap-10"
          >
            {/* Steam — 그릇 안에서 위로 올라오는 연기 */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: '108px',          // 그릇 rim 위 (bowl SVG height=130)
                left: '50%',
                transform: 'translateX(-50%)',
                width: '200px',
                height: '520px',
                overflow: 'visible',
                maskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 35%, transparent 75%)',
                WebkitMaskImage: 'linear-gradient(to top, rgba(0,0,0,0.9) 0%, rgba(0,0,0,0.6) 35%, transparent 75%)',
              }}
            >
              {wisps.map((w) => (
                <motion.div
                  key={w.id}
                  className="absolute rounded-full"
                  style={{
                    left: `${w.x}%`,
                    bottom: '0',
                    width: `${w.size}px`,
                    height: `${w.size}px`,
                    background: 'rgba(255, 253, 251, 0.62)',
                    filter: `url(#steam-turbulence) blur(${w.size * 0.2}px)`,
                  }}
                  animate={{
                    y: [0, -(w.size * 18)],
                    x: [0, w.drift * 0.3, w.drift, w.drift * 0.5, 0],
                    opacity: [0, 0.72, 0.5, 0.28, 0],
                    scale: [0.3, 0.85, 1.4, 1.9, 2.3],
                  }}
                  transition={{
                    duration: w.duration,
                    delay: w.delay,
                    repeat: Infinity,
                    ease: [0.2, 0, 0.8, 1],
                  }}
                />
              ))}
            </div>

            <GukbapBowl />
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

// ─── Default scene (future poems) ─────────────────────────────
function DefaultScene({ poem }: { poem: Poem }) {
  const stanzas = poem.content.trim().split(/\n\n+/)
  return (
    <main className="relative bg-[#0c0b0a] text-[#f0ede8]">
      <BackNav />
      <div className="max-w-[480px] mx-auto px-8">
        <div className="min-h-screen flex flex-col justify-center">
          <p className="text-[11px] tracking-[0.5em] opacity-28 mb-6">
            {new Date(poem.date).getFullYear()} · {poem.mood}
          </p>
          <h1 className="font-serif text-4xl leading-snug mb-16">{poem.title}</h1>
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
