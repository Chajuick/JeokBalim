'use client'

import { useEffect, useMemo, useState } from 'react'
import { motion, useTransform, useMotionValue, MotionValue } from 'framer-motion'
import type { Poem } from '@/lib/poems'
import BackNav from '@/components/poem/BackNav'
import StanzaBlock from '@/components/poem/StanzaBlock'
import useScrollProgress from '@/hooks/useScrollProgress'

// ------------------------------------------------------------------
// 타입 정의
// ------------------------------------------------------------------
type MoteData = { id: number; x: number; y: number; size: number; duration: number; delay: number; opacity: number }
type CreaseData = { id: number; d: string; from: number; to: number; width: number; opacity: number }

// 종이에 새겨지는 순서 — 스크롤이 곧 접는 손의 속도
const CREASES: CreaseData[] = [
  { id: 1, d: 'M 110 26 L 110 274', from: 0.06, to: 0.26, width: 0.9, opacity: 0.55 },
  { id: 2, d: 'M 41 150 L 179 150', from: 0.18, to: 0.38, width: 0.9, opacity: 0.5 },
  { id: 3, d: 'M 41 26 L 110 150', from: 0.3, to: 0.5, width: 0.7, opacity: 0.42 },
  { id: 4, d: 'M 179 26 L 110 150', from: 0.3, to: 0.5, width: 0.7, opacity: 0.42 },
  { id: 5, d: 'M 41 212 L 179 212', from: 0.42, to: 0.6, width: 0.7, opacity: 0.38 },
]

// ------------------------------------------------------------------
// 자식 컴포넌트: 접힌 자국 (pathLength로 '그어지는' 선)
// ------------------------------------------------------------------
function Crease({ progress, crease }: { progress: MotionValue<number>; crease: CreaseData }) {
  const pathLength = useTransform(progress, [crease.from, crease.to], [0, 1], { clamp: true })
  const opacity = useTransform(progress, [crease.from, crease.to, 0.72], [0, crease.opacity, 0], { clamp: true })

  return (
    <motion.path
      d={crease.d}
      fill="none"
      stroke="#6b6255"
      strokeWidth={crease.width}
      strokeLinecap="round"
      style={{ pathLength, opacity, willChange: 'opacity' }}
    />
  )
}

// ------------------------------------------------------------------
// 자식 컴포넌트: 빛 속을 떠다니는 종이 먼지
// ------------------------------------------------------------------
function Mote({ mote }: { mote: MoteData }) {
  return (
    <span
      className="absolute rounded-full bg-[#f0ede8]"
      style={{
        left: `${mote.x}%`,
        top: `${mote.y}%`,
        width: mote.size,
        height: mote.size,
        opacity: mote.opacity,
        animation: `moteDrift ${mote.duration}s ease-in-out infinite`,
        animationDelay: `${mote.delay}s`,
        willChange: 'transform, opacity',
      }}
    />
  )
}

// ------------------------------------------------------------------
// 메인 Scene 컴포넌트
// ------------------------------------------------------------------
export default function PaperFoldScene({ poem }: { poem: Poem }) {
  const rawProgress = useScrollProgress()
  const progress = useMotionValue(0)

  const [motes, setMotes] = useState<MoteData[]>([])

  useEffect(() => {
    progress.set(rawProgress)
  }, [rawProgress, progress])

  useEffect(() => {
    const generated: MoteData[] = Array.from({ length: 46 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: 10 + Math.random() * 85,
      size: 1 + Math.random() * 1.8,
      duration: 12 + Math.random() * 14,
      delay: Math.random() * 16,
      opacity: 0.06 + Math.random() * 0.16,
    }))

    const timer = setTimeout(() => setMotes(generated), 0)
    return () => clearTimeout(timer)
  }, [])

  const stanzas = useMemo(() => poem.content.trim().split(/\n\n+/), [poem.content])

  // 배경: 서랍 속의 어둠에서 물가의 어둠으로
  const bgFill = useTransform(progress, [0, 0.7, 1], ['#100f0e', '#131311', '#101314'])

  // 종이의 자세 — 펴진 채 정면이다가, 접히며 몸을 기울인다
  const sheetY = useTransform(progress, [0, 0.75, 1], ['0vh', '4vh', '7vh'])
  const sheetScale = useTransform(progress, [0, 0.55, 0.8], [1, 0.94, 0.8])
  const sheetRotate = useTransform(progress, [0, 0.5, 0.8], [0, -3, -1.5])

  // 평평한 종이에서 종이배로 건너가는 순간
  const flatOpacity = useTransform(progress, [0.58, 0.74], [1, 0], { clamp: true })
  const boatOpacity = useTransform(progress, [0.62, 0.8], [0, 1], { clamp: true })
  const foldShade = useTransform(progress, [0.3, 0.62], [0, 0.4], { clamp: true })

  // 물은 마지막에야 차오른다
  const waterOpacity = useTransform(progress, [0.72, 0.95], [0, 1], { clamp: true })

  return (
    <motion.main
      className="min-h-screen text-[#e8e4de] selection:bg-white/5 relative font-sans overflow-hidden"
      style={{ backgroundColor: bgFill }}
    >
      <BackNav />

      {/* 성능 최적화용 CSS Keyframes 주입 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes moteDrift {
          0%   { transform: translate3d(0, 0, 0); }
          50%  { transform: translate3d(6px, -34px, 0); }
          100% { transform: translate3d(0, 0, 0); }
        }
        @keyframes boatRock {
          0%, 100% { transform: translateY(-4px) rotate(-1.2deg); }
          50%      { transform: translateY(4px) rotate(1.2deg); }
        }
        @keyframes sheenSweep {
          0%   { transform: translateX(-120%); }
          100% { transform: translateX(220%); }
        }
        @keyframes waterMove {
          100% { transform: translateX(-600px); }
        }
      `}} />

      {/* 위에서 비스듬히 내려오는 빛 — 자국은 빛에 비출 때만 보인다 */}
      <div
        className="fixed inset-0 z-0 pointer-events-none"
        style={{
          background:
            'radial-gradient(120% 70% at 50% -10%, rgba(238,231,214,0.10) 0%, rgba(238,231,214,0.03) 35%, transparent 70%)',
        }}
      />

      {/* 떠다니는 종이 먼지 */}
      <div className="fixed inset-0 z-0 pointer-events-none">
        {motes.map((mote) => (
          <Mote key={`mote-${mote.id}`} mote={mote} />
        ))}
      </div>

      {/* 종이 — 모바일에선 작고 아래쪽에, 데스크톱에선 본문 오른편으로 비켜선다 */}
      <motion.div
        className="fixed inset-0 z-0 flex items-center justify-center pt-[14vh] pb-0 md:pt-0 md:justify-end md:pr-[7vw] pointer-events-none"
        style={{ y: sheetY, willChange: 'transform' }}
      >
        <motion.div
          className="relative h-[52vh] md:h-[72vh] aspect-[220/300]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 2, ease: [0.22, 1, 0.36, 1], delay: 0.3 }}
          style={{ scale: sheetScale, rotate: sheetRotate, willChange: 'transform' }}
        >
          <svg viewBox="0 0 220 300" className="w-full h-full overflow-visible">
            <defs>
              <linearGradient id="pfPaper" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#f2ede1" />
                <stop offset="55%" stopColor="#e3dccc" />
                <stop offset="100%" stopColor="#cfc7b5" />
              </linearGradient>
              <linearGradient id="pfPaperDim" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ded7c6" />
                <stop offset="100%" stopColor="#b8b09d" />
              </linearGradient>
              <linearGradient id="pfSheen" x1="0" y1="0" x2="1" y2="0">
                <stop offset="0%" stopColor="rgba(255,255,255,0)" />
                <stop offset="50%" stopColor="rgba(255,255,255,0.22)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <clipPath id="pfSheetClip">
                <path d="M 41 26 L 179 26 L 179 274 L 41 274 Z" />
              </clipPath>
            </defs>

            {/* 1) 아직 아무것도 아닌, 평평한 종이 */}
            <motion.g style={{ opacity: flatOpacity, willChange: 'opacity' }}>
              <path d="M 41 26 L 179 26 L 179 274 L 41 274 Z" fill="url(#pfPaper)" />

              {/* 접히며 생기는 음영 */}
              <motion.path
                d="M 41 26 L 110 26 L 110 150 L 41 150 Z"
                fill="#8f8776"
                style={{ opacity: foldShade, willChange: 'opacity' }}
              />

              {/* 접힌 자국들 */}
              {CREASES.map((crease) => (
                <Crease key={`crease-${crease.id}`} progress={progress} crease={crease} />
              ))}

              {/* 종이 위를 훑고 지나가는 빛 */}
              <g clipPath="url(#pfSheetClip)">
                <rect
                  x="41"
                  y="26"
                  width="46"
                  height="248"
                  fill="url(#pfSheen)"
                  style={{ animation: 'sheenSweep 9s ease-in-out infinite', willChange: 'transform' }}
                />
              </g>
            </motion.g>

            {/* 2) 접힌 자리를 따라 생겨난 모양 — 종이배 */}
            <motion.g style={{ opacity: boatOpacity, willChange: 'opacity' }}>
              <g
                style={{
                  animation: 'boatRock 7s ease-in-out infinite',
                  transformOrigin: '110px 210px',
                  willChange: 'transform',
                }}
              >
                {/* 돛 */}
                <path d="M 110 190 L 110 104 L 44 190 Z" fill="url(#pfPaper)" />
                <path d="M 110 190 L 110 104 L 176 190 Z" fill="url(#pfPaperDim)" />
                {/* 배 밑 */}
                <path d="M 30 190 L 190 190 L 162 233 L 58 233 Z" fill="url(#pfPaper)" />
                <path d="M 110 190 L 190 190 L 162 233 L 110 233 Z" fill="#c6bfae" />
                {/* 끝까지 모양을 붙드는 선 */}
                <path d="M 110 104 L 110 233" stroke="#6b6255" strokeWidth="0.9" strokeLinecap="round" opacity="0.45" />
                <path d="M 30 190 L 190 190" stroke="#6b6255" strokeWidth="0.9" strokeLinecap="round" opacity="0.35" />
              </g>
            </motion.g>
          </svg>
        </motion.div>
      </motion.div>

      {/* 물 — 가장 먼저 젖는 곳 */}
      <motion.div
        className="fixed bottom-0 left-0 right-0 h-[30vh] z-0 pointer-events-none"
        style={{
          opacity: waterOpacity,
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 10%, black 26%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.6) 10%, black 26%)',
          willChange: 'opacity',
        }}
      >
        <div className="absolute inset-0 bg-gradient-to-b from-white/[0.05] via-white/[0.02] to-transparent" />
        <div
          className="absolute top-0 left-0 w-full h-[70px]"
          style={{
            maskImage: 'linear-gradient(to bottom, black 25%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 25%, transparent 100%)',
          }}
        >
          <svg viewBox="0 0 1200 70" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="pfWave1" x1="0" y1="30" x2="0" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(232,228,222,0.22)" />
                <stop offset="100%" stopColor="rgba(232,228,222,0)" />
              </linearGradient>
              <linearGradient id="pfWave2" x1="0" y1="20" x2="0" y2="70" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(232,228,222,0.34)" />
                <stop offset="100%" stopColor="rgba(232,228,222,0)" />
              </linearGradient>
            </defs>
            <path
              d="M 0 34 Q 150 52 300 34 T 600 34 T 900 34 T 1200 34 T 1500 34 T 1800 34 L 1800 70 L 0 70 Z"
              fill="url(#pfWave1)"
              style={{ animation: 'waterMove 14s linear infinite', willChange: 'transform' }}
            />
            <path
              d="M 0 44 Q 150 26 300 44 T 600 44 T 900 44 T 1200 44 T 1500 44 T 1800 44 L 1800 70 L 0 70 Z"
              fill="url(#pfWave2)"
              style={{ animation: 'waterMove 9s linear infinite', willChange: 'transform' }}
            />
          </svg>
        </div>
      </motion.div>

      {/* 가독성 장막 — 종이(밝은 크림)와 본문(#e8e4de)이 겹치는 구간을 눌러준다.
          모바일: 본문이 화면 전폭을 쓰므로 전면을 고르게 어둡게
          데스크톱: 본문이 놓인 왼쪽만 어둡게 하고 종이는 밝게 남긴다 */}
      <div
        className="fixed inset-0 z-[5] pointer-events-none md:hidden"
        style={{ backgroundColor: 'rgba(12,11,10,0.62)' }}
      />
      <div
        className="fixed inset-0 z-[5] pointer-events-none hidden md:block"
        style={{
          background:
            'linear-gradient(to right, rgba(12,11,10,0.82) 0%, rgba(12,11,10,0.66) 26%, rgba(12,11,10,0.22) 48%, rgba(12,11,10,0) 62%)',
        }}
      />

      {/* 본문 텍스트 */}
      <div className="relative z-10 w-full px-8 pt-[20vh] pb-[45vh] md:pl-[10vw] md:pr-[48vw] max-w-[1400px] mx-auto pointer-events-none">
        <header className="mb-[40vh]">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
            className="poem-title font-serif text-5xl md:text-[4.5rem] leading-[1.1] tracking-tight"
            style={{ textShadow: '0px 2px 14px rgba(12,11,10,0.95), 0px 0px 32px rgba(12,11,10,0.8)' }}
          >
            {poem.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 2.5, duration: 1.2 }}
            className="mt-12 flex items-center gap-4"
          >
            <span className="w-10 h-[1px] bg-current"></span>
            <span className="text-[10px] tracking-[0.5em] uppercase">Along the crease</span>
          </motion.div>
        </header>

        <div className="space-y-[50vh]">
          {stanzas.map((stanza, i) => (
            <StanzaBlock
              key={i}
              stanza={stanza}
              className="max-w-[420px]"
              textShadow="0px 2px 10px rgba(12,11,10,0.95), 0px 0px 26px rgba(12,11,10,0.8)"
            />
          ))}
        </div>
      </div>
    </motion.main>
  )
}
