'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import type { Poem } from '@/lib/poems'
import BackNav from '@/components/poem/BackNav'
import StanzaBlock from '@/components/poem/StanzaBlock'
import useScrollProgress from '@/hooks/useScrollProgress'

type SteamWisp = {
  id: number
  x: number
  delay: number
  duration: number
  size: number
  drift: number
}

function GukbapBowl() {
  return (
    <svg viewBox="0 0 240 130" width="240" height="130" style={{ opacity: 0.76 }}>
      {/* 바깥 뚝배기 */}
      <path
        d="M 25 45 Q 15 95 30 112 Q 55 126 120 126 Q 185 126 210 112 Q 225 95 215 45"
        fill="rgba(18,18,18,0.95)"
        stroke="rgba(245,245,245,0.14)"
        strokeWidth="1.4"
        strokeLinejoin="round"
      />

      {/* 윗 테두리 */}
      <ellipse
        cx="120"
        cy="45"
        rx="95"
        ry="22"
        fill="rgba(20,20,20,0.98)"
        stroke="rgba(245,245,245,0.20)"
        strokeWidth="1.2"
      />

      {/* 국물 */}
      <ellipse
        cx="120"
        cy="45"
        rx="81"
        ry="16"
        fill="rgba(242,240,235,0.9)"
      />

      {/* 국물 중앙 하이라이트 */}
      <ellipse
        cx="114"
        cy="43"
        rx="34"
        ry="7"
        fill="rgba(255,255,255,0.15)"
      />

      {/* 표면 반사광 */}
      <ellipse
        cx="95"
        cy="38"
        rx="26"
        ry="4"
        fill="rgba(255,255,255,0.07)"
      />

      {/* 아래쪽 미세 윤곽 */}
      <path
        d="M 48 104 Q 120 120 192 104"
        fill="none"
        stroke="rgba(255,255,255,0.05)"
        strokeWidth="1"
        strokeLinecap="round"
      />
    </svg>
  )
}

function SaltShaker() {
  return (
    <svg viewBox="0 0 70 110" width="52" height="82" style={{ opacity: 0.72 }}>
      <rect x="22" y="8" width="26" height="14" rx="4" fill="rgba(28,28,28,0.96)" />
      <rect
        x="16"
        y="18"
        width="38"
        height="64"
        rx="12"
        fill="rgba(255,255,255,0.08)"
        stroke="rgba(255,255,255,0.18)"
        strokeWidth="1.2"
      />
      <rect x="20" y="24" width="30" height="52" rx="10" fill="rgba(245,245,245,0.08)" />
      <ellipse cx="35" cy="86" rx="22" ry="8" fill="rgba(255,255,255,0.05)" />
    </svg>
  )
}

function KimchiDish() {
  return (
    <svg viewBox="0 0 96 54" width="80" height="46" style={{ opacity: 0.82 }}>
      <ellipse cx="48" cy="40" rx="34" ry="10" fill="rgba(250,250,250,0.08)" />
      <ellipse
        cx="48"
        cy="28"
        rx="30"
        ry="12"
        fill="rgba(242,240,235,0.92)"
        stroke="rgba(255,255,255,0.16)"
        strokeWidth="1"
      />
      <path d="M30 24 C34 16, 44 16, 46 24 C42 28, 35 29, 30 24Z" fill="rgba(170,45,28,0.88)" />
      <path d="M44 26 C48 18, 60 18, 63 27 C58 31, 49 31, 44 26Z" fill="rgba(186,52,30,0.92)" />
      <path d="M38 31 C42 26, 53 25, 57 32 C51 35, 43 35, 38 31Z" fill="rgba(120,24,18,0.84)" />
    </svg>
  )
}

export default function SteamScene({ poem }: { poem: Poem }) {
  const stanzas = poem.content.trim().split(/\n\n+/)
  const progress = useScrollProgress()

  // 화면 전체 공기처럼 깔리는 김
  const [ambientWisps] = useState<SteamWisp[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      x: 36 + Math.random() * 28,
      delay: Math.random() * 8,
      duration: 14 + Math.random() * 8,
      size: 34 + Math.random() * 20,
      drift: (Math.random() - 0.5) * 24,
    }))
  )

  // 실제 뚝배기에서 올라오는 김
  const [bowlWisps] = useState<SteamWisp[]>(() =>
    Array.from({ length: 7 }, (_, i) => ({
      id: i,
      x: 44 + Math.random() * 12,
      delay: Math.random() * 9,
      duration: 10 + Math.random() * 6,
      size: 22 + Math.random() * 16,
      drift: (Math.random() - 0.5) * 18,
    }))
  )

  // 아래에서 올라오는 하얀 온기
  const floorGlow = Math.pow(progress, 1.6) * 0.22

  // 초반에도 아주 약하게 보이고, 중반부터 살아나고, 마지막엔 조금 고요해짐
  const ambientSteamOpacity =
    progress < 0.12
      ? 0.05 + (progress / 0.12) * 0.08
      : progress < 0.72
        ? 0.13 + ((progress - 0.12) / 0.6) * 0.18
        : 0.31 - ((progress - 0.72) / 0.28) * 0.06

  const bowlSteamOpacity =
    progress < 0.18
      ? (progress / 0.18) * 0.16
      : progress < 0.78
        ? 0.16 + ((progress - 0.18) / 0.6) * 0.66
        : 0.82 - ((progress - 0.78) / 0.22) * 0.18

  const shaftOpacity = 0.06 + progress * 0.12
  const vignetteOpacity = 0.12 + progress * 0.18

  return (
    <main className="relative bg-[#090909] text-[#f3f1ed]">
      <BackNav />

      {/* 연기 형태용 turbulence */}
      <svg style={{ display: 'none' }}>
        <defs>
          <filter id="steam-turbulence" x="-40%" y="-40%" width="180%" height="180%">
            <feTurbulence
              type="fractalNoise"
              baseFrequency="0.018 0.011"
              numOctaves="4"
              seed="7"
              result="noise"
            />
            <feDisplacementMap
              in="SourceGraphic"
              in2="noise"
              scale="10"
              xChannelSelector="R"
              yChannelSelector="G"
            />
          </filter>
        </defs>
      </svg>

      {/* 아래에서 올라오는 흰 온기 */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `linear-gradient(
            to top,
            rgba(255,255,255,${floorGlow}) 0%,
            rgba(255,255,255,${floorGlow * 0.14}) 24%,
            transparent 58%
          )`,
        }}
      />

      {/* 아래 국밥에서 올라오는 중심 기운 */}
      <div
        className="fixed left-1/2 bottom-0 -translate-x-1/2 pointer-events-none z-0"
        style={{
          width: '92px',
          height: '54vh',
          opacity: shaftOpacity,
          background:
            'linear-gradient(to top, rgba(255,255,255,0.16) 0%, rgba(255,255,255,0.06) 34%, transparent 100%)',
          filter: 'blur(24px)',
        }}
      />

      {/* 화면 전체에 깔리는 ambient steam */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          opacity: ambientSteamOpacity,
          maskImage:
            'linear-gradient(to top, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.28) 18%, rgba(0,0,0,0.82) 58%, transparent 94%)',
          WebkitMaskImage:
            'linear-gradient(to top, rgba(0,0,0,0.0) 0%, rgba(0,0,0,0.28) 18%, rgba(0,0,0,0.82) 58%, transparent 94%)',
        }}
      >
        {ambientWisps.map((w) => (
          <motion.div
            key={w.id}
            className="absolute rounded-full"
            style={{
              left: `${w.x}%`,
              bottom: '-4%',
              width: `${w.size}px`,
              height: `${w.size * 1.6}px`,
              background: 'rgba(255,255,255,0.13)',
              filter: `url(#steam-turbulence) blur(${w.size * 0.24}px)`,
            }}
            animate={{
              y: [0, -(w.size * 22)],
              x: [0, w.drift * 0.35, w.drift, 0],
              opacity: [0, 0.22, 0.16, 0],
              scale: [0.55, 1, 1.24, 1.44],
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

      {/* 가장자리 암부 */}
      <div
        className="fixed inset-0 pointer-events-none z-0"
        style={{
          background: `radial-gradient(
            circle at center,
            transparent 0%,
            transparent 42%,
            rgba(0,0,0,${vignetteOpacity * 0.22}) 72%,
            rgba(0,0,0,${vignetteOpacity * 0.62}) 100%
          )`,
        }}
      />

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
              textShadow: '0 0 18px rgba(255,255,255,0.05)',
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
            const textOpacity = Math.max(0.72, 0.98 - i * 0.035 - progress * 0.06)

            return (
              <section
                key={i}
                className="min-h-[70vh] flex items-center"
                style={{ opacity: textOpacity }}
              >
                <StanzaBlock
                  stanza={stanza}
                  textShadow="0 0 24px rgba(9,9,9,0.98), 0 0 50px rgba(9,9,9,0.90), 0 2px 4px rgba(0,0,0,0.96)"
                />
              </section>
            )
          })}
        </div>

        {/* 하단 국밥 장면 */}
        <div className="min-h-[64vh] flex flex-col justify-end items-center pb-20 px-8">
          <motion.div
            initial={{ opacity: 0, y: 34 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-80px' }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1] }}
            className="relative flex flex-col items-center gap-10"
          >
            {/* 실제 뚝배기에서 올라오는 김 */}
            <div
              className="absolute pointer-events-none"
              style={{
                bottom: '108px',
                left: '50%',
                transform: 'translateX(-50%)',
                width: '230px',
                height: '520px',
                overflow: 'visible',
                opacity: bowlSteamOpacity,
                maskImage:
                  'linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.72) 34%, transparent 80%)',
                WebkitMaskImage:
                  'linear-gradient(to top, rgba(0,0,0,0.94) 0%, rgba(0,0,0,0.72) 34%, transparent 80%)',
              }}
            >
              {bowlWisps.map((w) => (
                <motion.div
                  key={w.id}
                  className="absolute rounded-full"
                  style={{
                    left: `${w.x}%`,
                    bottom: '0',
                    width: `${w.size}px`,
                    height: `${w.size}px`,
                    background: 'rgba(255,255,255,0.58)',
                    filter: `url(#steam-turbulence) blur(${w.size * 0.18}px)`,
                  }}
                  animate={{
                    y: [0, -(w.size * 13)],
                    x: [0, w.drift * 0.25, w.drift, w.drift * 0.45, 0],
                    opacity: [0, 0.42, 0.32, 0.18, 0],
                    scale: [0.45, 0.92, 1.18, 1.42, 1.7],
                  }}
                  transition={{
                    duration: w.duration,
                    delay: w.delay,
                    repeat: Infinity,
                    ease: [0.2, 0, 0.8, 1],
                  }}
                />
              ))}

              {/* 중앙 기둥형 김 */}
              <div
                style={{
                  position: 'absolute',
                  left: '50%',
                  bottom: 0,
                  transform: 'translateX(-50%)',
                  width: '58px',
                  height: '240px',
                  opacity: bowlSteamOpacity * 0.3,
                  background:
                    'linear-gradient(to top, rgba(255,255,255,0.20) 0%, rgba(255,255,255,0.08) 28%, transparent 100%)',
                  filter: 'blur(16px)',
                }}
              />
            </div>

            {/* 소금통 */}
            <div className="absolute left-[-66px] bottom-[24px]">
              <SaltShaker />
            </div>

            {/* 김치 종지 */}
            <div className="absolute right-[-92px] bottom-[6px]">
              <KimchiDish />
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