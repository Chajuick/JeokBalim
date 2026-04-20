'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, useTransform, useMotionValue, MotionValue } from 'framer-motion'
import type { Poem } from '@/lib/poems'
import BackNav from '@/components/poem/BackNav'
import StanzaBlock from '@/components/poem/StanzaBlock'
import useScrollProgress from '@/hooks/useScrollProgress'

// ------------------------------------------------------------------
// 타입 정의
// ------------------------------------------------------------------
type BubbleData = { id: number; x: number; size: number; duration: number; delay: number; maxOpacity: number }
type ShellData = { id: number; path: string; tx: number; ty: number; r: number }

// ------------------------------------------------------------------
// 자식 컴포넌트: 은은한 기포 (최적화: 무한 상승은 CSS로, 투명도만 Framer로)
// ------------------------------------------------------------------
function AnimatedBubble({ progress, bubble }: { progress: MotionValue<number>; bubble: BubbleData }) {
  const opacity = useTransform(progress, [0, 1], [bubble.maxOpacity * 0.4, bubble.maxOpacity])

  return (
    // framer-motion은 스크롤에 따른 투명도만 관리 (메인 스레드 부하 최소화)
    <motion.g style={{ opacity, willChange: 'opacity' }}>
      {/* 순수 SVG circle과 CSS animation을 통해 하드웨어 가속으로 무한 상승 */}
      <circle
        cx={bubble.x}
        cy={110}
        r={bubble.size}
        fill="#ffffff"
        style={{
          animation: `bubbleRise ${bubble.duration}s linear infinite`,
          animationDelay: `${bubble.delay}s`,
          willChange: 'transform'
        }}
      />
    </motion.g>
  )
}

// ------------------------------------------------------------------
// 자식 컴포넌트: 껍질 파편 (최적화: will-change 적용)
// ------------------------------------------------------------------
function ShellFragment({ progress, shell }: { progress: MotionValue<number>; shell: ShellData }) {
  const x = useTransform(progress, [0.65, 0.95], [0, shell.tx])
  const y = useTransform(progress, [0.65, 0.95], [0, shell.ty])
  const rotate = useTransform(progress, [0.65, 0.95], [0, shell.r])
  const opacity = useTransform(progress, [0.8, 0.98], [1, 0])

  return (
    <motion.path
      d={shell.path}
      fill="#fcfaf5"
      stroke="none"
      style={{
        x,
        y,
        rotate,
        opacity,
        transformOrigin: '50px 50px',
        willChange: 'transform, opacity' // GPU 컴포지팅 강제
      }}
    />
  )
}

// ------------------------------------------------------------------
// 메인 Scene 컴포넌트
// ------------------------------------------------------------------
export default function BoiledEggScene({ poem }: { poem: Poem }) {
  const rawProgress = useScrollProgress()
  const progress = useMotionValue(0)

  const [sceneData, setSceneData] = useState<{ bubbles: BubbleData[], shells: ShellData[] }>({
    bubbles: [],
    shells: [],
  })

  useEffect(() => {
    progress.set(rawProgress)
  }, [rawProgress, progress])

  useEffect(() => {
    const generatedBubbles: BubbleData[] = Array.from({ length: 80 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      size: 0.3 + Math.random() * 0.8,
      duration: 4 + Math.random() * 6,
      delay: Math.random() * 10,
      maxOpacity: 0.1 + Math.random() * 0.2,
    }))

    const generatedShells: ShellData[] = [
      { id: 1, path: "M 50 5 C 30 5, 18 30, 18 55 L 45 45 L 50 60 L 65 45 L 82 55 C 82 30, 70 5, 50 5 Z", tx: 10, ty: -90, r: 25 },
      { id: 2, path: "M 18 55 L 45 45 L 50 65 L 50.5 95 C 30 95, 18 80, 18 55 Z", tx: -70, ty: 40, r: -40 },
      { id: 3, path: "M 82 55 L 65 45 L 50 65 L 49.5 95 C 70 95, 82 80, 82 55 Z", tx: 80, ty: 35, r: 45 },
      { id: 4, path: "M 45 45 L 50 60 L 65 45 L 50 65 Z", tx: 0, ty: 100, r: 10 },
    ]

    const timer = setTimeout(() => {
      setSceneData({ bubbles: generatedBubbles, shells: generatedShells })
    }, 0)
    return () => clearTimeout(timer)
  }, [])

  const stanzas = useMemo(() => poem.content.trim().split(/\n\n+/), [poem.content])

  const coreOpacity = useTransform(progress, [0.7, 0.9], [0, 1])
  const coreGlow = useTransform(progress, [0.75, 0.98], ['0px 0px 0px rgba(255,210,100,0)', '0px 0px 100px rgba(255,190,80,0.6)'])
  const bgFill = useTransform(progress, [0, 1], ['#121415', '#1a1c1d'])

  return (
    <motion.main 
      className="min-h-screen text-[#e8e4de] selection:bg-white/5 relative font-sans overflow-hidden"
      style={{ backgroundColor: bgFill }}
    >
      <BackNav />

      {/* 글로벌 성능 최적화용 CSS Keyframes 주입 */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes bubbleRise {
          0% { transform: translateY(0); }
          100% { transform: translateY(-120px); }
        }
        @keyframes waveMove {
          100% { transform: translateX(-600px); }
        }
        @keyframes eggFloat {
          0%, 100% { transform: translateY(-15px) rotate(-1.5deg); }
          50% { transform: translateY(15px) rotate(1.5deg); }
        }
      `}} />

      {/* 끓는 물의 공간 — 컨테이너 자체에 mask로 경계 소거 */}
      <div
        className="fixed bottom-0 left-0 right-0 h-[92vh] z-0 pointer-events-none"
        style={{
          maskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 7%, black 18%)',
          WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, rgba(0,0,0,0.5) 7%, black 18%)',
        }}
      >
        {/* 수면 파도 — 상하 모두 fade로 경계 소거 */}
        <div
          className="absolute top-0 left-0 w-full h-[80px] z-10"
          style={{
            maskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, black 20%, transparent 100%)',
          }}
        >
          <svg viewBox="0 0 1200 80" preserveAspectRatio="none" className="w-full h-full">
            <defs>
              <linearGradient id="wg1" x1="0" y1="40" x2="0" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255,255,255,0.3)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
              <linearGradient id="wg2" x1="0" y1="30" x2="0" y2="80" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255,255,255,0.45)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
              </linearGradient>
            </defs>
            <path
              d="M 0 40 Q 150 60 300 40 T 600 40 T 900 40 T 1200 40 T 1500 40 T 1800 40 L 1800 80 L 0 80 Z"
              fill="url(#wg1)"
              style={{ animation: 'waveMove 10s linear infinite', willChange: 'transform' }}
            />
            <path
              d="M 0 50 Q 150 30 300 50 T 600 50 T 900 50 T 1200 50 T 1500 50 T 1800 50 L 1800 80 L 0 80 Z"
              fill="url(#wg2)"
              style={{ animation: 'waveMove 7s linear infinite', willChange: 'transform' }}
            />
          </svg>
        </div>

        {/* 유백색 물 속 */}
        <div className="absolute inset-0 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-b from-white/[0.06] via-white/[0.02] to-transparent pointer-events-none" />
          
          <svg className="absolute inset-0 w-full h-full" preserveAspectRatio="none">
            {sceneData.bubbles.map((bubble) => (
              <svg key={`bubble-${bubble.id}`} viewBox="0 0 100 100" className="overflow-visible">
                <AnimatedBubble progress={progress} bubble={bubble} />
              </svg>
            ))}
          </svg>

          {/* 중앙의 대형 계란 */}
          <div className="absolute inset-0 flex items-center justify-center -translate-y-[8vh]">
            <motion.div
              initial={{ y: -900, opacity: 0, rotate: -10 }}
              animate={{ y: 0, opacity: 1, rotate: 0 }}
              transition={{ type: 'spring', stiffness: 25, damping: 12, delay: 0.4 }}
              className="relative w-[200px] h-[280px] md:w-[280px] md:h-[380px]"
            >
              {/* 계란 둥실거림 (최적화: CSS animation 적용) */}
              <div
                className="w-full h-full relative"
                style={{ animation: 'eggFloat 6s ease-in-out infinite', willChange: 'transform' }}
              >
                {/* 빛나는 노란 중심핵 */}
                <motion.div
                  className="absolute inset-0 m-auto w-[50%] h-[50%] rounded-full bg-gradient-to-br from-[#ffdc82] to-[#f2a83a]"
                  style={{
                    opacity: coreOpacity,
                    boxShadow: coreGlow,
                    willChange: 'opacity, box-shadow'
                  }}
                />

                {/* 껍질 조각 */}
                <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full overflow-visible">
                  {sceneData.shells.map((shell) => (
                    <ShellFragment key={`shell-${shell.id}`} progress={progress} shell={shell} />
                  ))}
                </svg>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* 본문 텍스트 */}
      <div className="relative z-10 w-full px-8 pt-[20vh] pb-[45vh] md:pl-[12vw] md:pr-[45vw] max-w-[1400px] mx-auto pointer-events-none">
        <header className="mb-[40vh]">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.5, ease: [0.22, 1, 0.36, 1], delay: 1.2 }}
            className="poem-title font-serif text-5xl md:text-[4.5rem] leading-[1.1] tracking-tight"
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
            <span className="text-[10px] tracking-[0.5em] uppercase">Becoming something</span>
          </motion.div>
        </header>

        <div className="space-y-[50vh]">
          {stanzas.map((stanza, i) => (
            <StanzaBlock 
              key={i} 
              stanza={stanza} 
              className="max-w-[420px]" 
              textShadow="0px 4px 20px rgba(0,0,0,0.6)"
            />
          ))}
        </div>
      </div>
    </motion.main>
  )
}