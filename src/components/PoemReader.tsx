'use client'

import { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import Link from 'next/link'
import type { Poem } from '@/lib/poems'

// ─── Keyboard hint ─────────────────────────────────────────────
function KeyboardHint({ visible, hasPrev, hasNext }: { visible: boolean; hasPrev: boolean; hasNext: boolean }) {
  return (
    <motion.div
      className="fixed bottom-8 left-1/2 -translate-x-1/2 z-50 flex gap-5 items-center pointer-events-none select-none"
      initial={{ opacity: 0, y: 6 }}
      animate={{ opacity: visible ? 0.36 : 0, y: visible ? 0 : 6 }}
      transition={{ duration: 0.7 }}
    >
      <span className={`text-[10px] tracking-[0.3em] text-[#e8e4de] transition-opacity ${hasPrev ? 'opacity-100' : 'opacity-20'}`}>
        ←
      </span>
      <span className="text-[10px] tracking-[0.35em] text-[#e8e4de]">esc 목록</span>
      <span className={`text-[10px] tracking-[0.3em] text-[#e8e4de] transition-opacity ${hasNext ? 'opacity-100' : 'opacity-20'}`}>
        →
      </span>
    </motion.div>
  )
}

// ─── Scene router ─────────────────────────────────────────────
export default function PoemReader({ poem, allSlugs = [] }: { poem: Poem; allSlugs?: string[] }) {
  const router = useRouter()
  const [hintVisible, setHintVisible] = useState(true)

  const idx = allSlugs.indexOf(poem.slug)
  const prevSlug = idx > 0 ? allSlugs[idx - 1] : null
  const nextSlug = idx >= 0 && idx < allSlugs.length - 1 ? allSlugs[idx + 1] : null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.push('/')
      if (e.key === 'ArrowLeft'  && prevSlug) router.push(`/poem/${prevSlug}`)
      if (e.key === 'ArrowRight' && nextSlug) router.push(`/poem/${nextSlug}`)
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router, prevSlug, nextSlug])

  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 3000)
    return () => clearTimeout(t)
  }, [])

  let scene: React.ReactNode
  if (poem.slug === '001') scene = <LightScene poem={poem} />
  else if (poem.slug === '002') scene = <RainScene poem={poem} />
  else if (poem.slug === '003') scene = <SteamScene poem={poem} />
  else if (poem.slug === '004') scene = <MoonScene poem={poem} />
  else if (poem.slug === '005') scene = <WeaponScene poem={poem} />
  else scene = <DefaultScene poem={poem} />

  return (
    <>
      {scene}
      <KeyboardHint visible={hintVisible} hasPrev={!!prevSlug} hasNext={!!nextSlug} />
    </>
  )
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

// ─── 004 달빛 · MoonScene ─────────────────────────────────────
// 보름달 → 스크롤 내릴수록 초승달 / 맨 아래 도시 야경

type Star = { id: number; x: number; y: number; size: number; delay: number; duration: number }

function MoonStars() {
  const [stars, setStars] = useState<Star[]>([])
  useEffect(() => {
    setStars(
      Array.from({ length: 55 }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 65,
        size: 0.6 + Math.random() * 1.6,
        delay: Math.random() * 5,
        duration: 2.5 + Math.random() * 4,
      }))
    )
  }, [])
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
          transition={{ duration: s.duration, delay: s.delay, repeat: Infinity, ease: 'easeInOut' }}
        />
      ))}
    </div>
  )
}

// 건물 데이터: [x, topY, width, hasAntenna]
const CITY_BUILDINGS: [number, number, number, boolean][] = [
  [0,   196, 34, false],
  [36,  142, 26, true ],
  [64,  170, 40, false],
  [106, 154, 20, false],
  [128, 115, 34, true ],
  [164, 180, 28, false],
  [194, 148, 22, false],
  [218,  82, 46, true ],   // 높은 빌딩
  [266, 163, 20, false],
  [288, 130, 32, false],
  [322, 172, 20, false],
  [344,  96, 42, true ],
  [388, 160, 28, false],
  [418,  64, 52, true ],   // 가장 높은 빌딩 (중심)
  [472, 152, 22, false],
  [496, 122, 36, false],
  [534, 168, 18, false],
  [554,  90, 44, true ],
  [600, 158, 22, false],
  [624, 134, 32, false],
  [658, 178, 24, false],
  [684,  78, 42, true ],   // 높은 빌딩
  [728, 148, 26, false],
  [756, 168, 20, false],
  [778, 103, 46, true ],
  [826, 153, 30, false],
  [858, 128, 32, false],
  [892, 170, 26, false],
  [920, 148, 30, false],
  [952, 188, 50, false],   // 끝까지 채움
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
        {/* 지평선 글로우 */}
        <ellipse cx="500" cy="266" rx="500" ry="52"
          fill={`rgba(55,30,8,${glow * 1.1})`} />

        {/* 건물들 */}
        {CITY_BUILDINGS.map(([bx, top, bw, hasAntenna], i) => (
          <g key={i}>
            <rect x={bx} y={top} width={bw} height={VIEW_H - top}
              fill={COLORS[i % COLORS.length]} />
            {hasAntenna && (
              <rect x={bx + Math.floor(bw / 2) - 2} y={top - 14} width={4} height={16}
                fill={COLORS[(i + 2) % COLORS.length]} />
            )}
          </g>
        ))}

        {/* 창문 불빛 — 결정론적 생성 */}
        {CITY_BUILDINGS.flatMap(([bx, top, bw]: [number, number, number, boolean], bi) => {
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

        {/* 바닥 */}
        <rect x="0" y="267" width="1000" height="6" fill="#03060d" />
      </svg>
    </div>
  )
}

function MoonScene({ poem }: { poem: Poem }) {
  const stanzas = poem.content.trim().split(/\n\n+/)
  const [progress, setProgress] = useState(0)
  const MOON = 175  // 달 크기 px

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      setProgress(el.scrollTop / (el.scrollHeight - el.clientHeight) || 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 달 위상 — SVG mask로 자연스러운 terminator 곡선
  const r = MOON / 2
  // terminatorRx: r(보름) → 0(반달) → r(초승)
  const terminatorRx = Math.abs(r * (1 - 2 * progress))
  const isGibbous = progress < 0.5
  // 달 주변 글로우 — 초승이 될수록 약해짐
  const moonGlow = 0.18 - progress * 0.14
  // 도시 불빛 — 스크롤 끝에 빛남
  const cityGlow = Math.pow(Math.max(0, progress - 0.6) / 0.4, 1.5)

  return (
    <main className="relative bg-[#04090f] text-[#f0ede8]">
      <BackNav />

      {/* 별 */}
      <MoonStars />

      {/* 달 — 고정 우상단 (SVG mask로 자연스러운 위상) */}
      <div
        className="fixed pointer-events-none z-10"
        style={{ top: '7vh', right: '7vw', width: MOON, height: MOON }}
      >
        <svg width={MOON} height={MOON} style={{ overflow: 'visible' }}>
          <defs>
            <radialGradient id="moon-rg" cx="38%" cy="34%">
              <stop offset="0%"   stopColor="rgba(255,252,210,0.72)" />
              <stop offset="45%"  stopColor="rgba(248,228,130,0.60)" />
              <stop offset="100%" stopColor="rgba(228,198,80,0.44)"  />
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
          {/* 글로우 — 위상에 맞게 마스킹 */}
          <circle cx={r} cy={r} r={r}
            fill={`rgba(248,220,100,${moonGlow * 3})`}
            filter="url(#mglow)"
            mask="url(#mphase)"
          />
          {/* 달 본체 */}
          <circle cx={r} cy={r} r={r}
            fill="url(#moon-rg)"
            mask="url(#mphase)"
          />
        </svg>
      </div>

      {/* 도시 광원 배경 */}
      <div
        className="fixed bottom-0 left-0 right-0 pointer-events-none z-0"
        style={{
          height: '40vh',
          background: `linear-gradient(to top, rgba(45,22,5,${cityGlow * 0.7}) 0%, transparent 100%)`,
        }}
      />

      {/* 스크롤 콘텐츠 */}
      <div className="relative z-10">
        {/* 제목 */}
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

        {/* 연 */}
        <div className="max-w-[480px] mx-auto px-8">
          {stanzas.map((stanza, i) => (
            <section key={i} className="min-h-[55vh] flex items-center">
              <StanzaBlock stanza={stanza} />
            </section>
          ))}
        </div>

        {/* 도시 야경 — 맨 아래 고정, 링크도 그 위에 */}
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

// ─── 005 연마 · WeaponScene ────────────────────────────────────
// 겉면 계속 연마 중 — 스크롤할수록 수평 스캔선이 빨라지고 많아짐

// 스캔선 정의: y위치(%), 속도, 폭, 몇% 스크롤부터 등장, 최대 불투명도, 방향
const SCAN_DEFS = [
  { id: 0,  y: 18, dur: 7.5, delay: 0.0, w: 26, minP: 0.00, op: 0.16, rev: false },
  { id: 1,  y: 76, dur: 9.2, delay: 3.4, w: 20, minP: 0.00, op: 0.13, rev: true  },
  { id: 2,  y: 42, dur: 3.8, delay: 0.7, w: 30, minP: 0.28, op: 0.22, rev: false },
  { id: 3,  y: 89, dur: 4.1, delay: 1.8, w: 22, minP: 0.28, op: 0.18, rev: true  },
  { id: 4,  y: 12, dur: 2.2, delay: 0.3, w: 33, minP: 0.55, op: 0.26, rev: false },
  { id: 5,  y: 58, dur: 1.9, delay: 0.9, w: 28, minP: 0.55, op: 0.24, rev: false },
  { id: 6,  y: 32, dur: 2.6, delay: 1.3, w: 25, minP: 0.55, op: 0.20, rev: true  },
  { id: 7,  y: 93, dur: 2.0, delay: 0.4, w: 24, minP: 0.55, op: 0.18, rev: true  },
  { id: 8,  y: 50, dur: 1.1, delay: 0.1, w: 36, minP: 0.80, op: 0.30, rev: false },
  { id: 9,  y: 66, dur: 1.0, delay: 0.5, w: 30, minP: 0.80, op: 0.28, rev: false },
  { id: 10, y: 25, dur: 1.4, delay: 0.6, w: 28, minP: 0.80, op: 0.24, rev: true  },
  { id: 11, y: 82, dur: 1.2, delay: 0.2, w: 32, minP: 0.80, op: 0.22, rev: true  },
]

function ScanLines({ progress }: { progress: number }) {
  return (
    <div
      className="fixed inset-0 pointer-events-none z-20"
      style={{ mixBlendMode: 'screen' }}
    >
      {SCAN_DEFS.map((s) => {
        const opacity = progress >= s.minP
          ? s.op * Math.min(1, (progress - s.minP) / 0.14)
          : 0

        const fromX = s.rev ? '100vw'      : `-${s.w}vw`
        const toX   = s.rev ? `-${s.w}vw` : '100vw'

        return (
          <motion.div
            key={s.id}
            style={{
              position: 'absolute',
              top: `${s.y}%`,
              height: '1.5px',
              width: `${s.w}vw`,
              background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.92) 50%, transparent 100%)',
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

// 마지막 연 등장 시 한꺼번에 쏴 지나가는 스캔선 burst
function FinalBurst() {
  const ref = useRef<HTMLDivElement>(null)
  const [fired, setFired] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setFired(true) },
      { threshold: 0.45 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  return (
    <div ref={ref} className="absolute inset-0">
      {fired && (
        <div
          className="fixed inset-0 pointer-events-none"
          style={{ zIndex: 30, mixBlendMode: 'screen' }}
        >
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

function WeaponScene({ poem }: { poem: Poem }) {
  const segments = poem.content.trim().split(/\n\n+/)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      setProgress(el.scrollTop / (el.scrollHeight - el.clientHeight) || 0)
    }
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // 배경: 차가운 어둠 → 은은한 핏빛 어둠
  const bgR = Math.round(7  + progress * 9)
  const bgG = Math.round(7  - progress * 3)
  const bgB = Math.round(12 - progress * 8)

  return (
    <main
      className="relative text-[#e8e4de]"
      style={{ background: `rgb(${bgR},${bgG},${bgB})` }}
    >
      <BackNav />
      <ScanLines progress={progress} />

      <div className="relative z-10">
        {/* 제목 */}
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
            className="font-serif text-4xl md:text-5xl leading-snug"
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

        {/* 시 본문 */}
        <div className="max-w-[480px] mx-auto px-8">
          {segments.map((seg, i) => {
            const trimmed = seg.trim()
            if (trimmed === '—') return <GrindDivider key={i} />

            const isVoid  = trimmed === '내부'
            const isFinal = i === segments.length - 1

            return (
              <section
                key={i}
                className={`relative flex ${isVoid ? 'items-start pt-20 min-h-[105vh]' : 'items-center min-h-[52vh]'}`}
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
                      className="font-serif text-[1.15rem] leading-[2.4] text-[#e8e4de]"
                    >
                      {line}
                    </motion.p>
                  ))}
                </motion.div>
              </section>
            )
          })}
        </div>

        {/* 끝 */}
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
