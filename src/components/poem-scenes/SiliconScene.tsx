'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, useMotionValue, useMotionTemplate, useTransform } from 'framer-motion'
import type { Poem } from '@/lib/poems'
import BackNav from '@/components/poem/BackNav'
import StanzaBlock from '@/components/poem/StanzaBlock'
import useScrollProgress from '@/hooks/useScrollProgress'

// ------------------------------------------------------------------
// 타입 정의
// ------------------------------------------------------------------
type DataStream = { id: number; x: number; width: number; duration: number; delay: number; opacity: number }

// ------------------------------------------------------------------
// 메인 Scene 컴포넌트
// ------------------------------------------------------------------
export default function SiliconScene({ poem }: { poem: Poem }) {
  const rawProgress = useScrollProgress()
  const progress = useMotionValue(0)

  // 마우스 추적용 값 (사용자를 비추는 거울 효과)
  const mouseX = useMotionValue(-1000)
  const mouseY = useMotionValue(-1000)

  const [streams, setStreams] = useState<DataStream[]>([])

  useEffect(() => {
    progress.set(rawProgress)
  }, [rawProgress, progress])

  useEffect(() => {
    // 렌더링 순수성(Purity)과 성능을 위해 랜덤 광섬유 데이터는 비동기로 한 번만 생성
    const generatedStreams: DataStream[] = Array.from({ length: 30 }, (_, i) => ({
      id: i,
      x: Math.random() * 100, // 화면 가로폭 비율
      width: 0.5 + Math.random() * 1.5,
      duration: 3 + Math.random() * 5,
      delay: Math.random() * 5,
      opacity: 0.05 + Math.random() * 0.15,
    }))

    const timer = setTimeout(() => setStreams(generatedStreams), 0)
    return () => clearTimeout(timer)
  }, [])

  function handleMouseMove(e: React.MouseEvent<HTMLElement>) {
    const { left, top } = e.currentTarget.getBoundingClientRect()
    mouseX.set(e.clientX - left)
    mouseY.set(e.clientY - top)
  }

  const stanzas = useMemo(() => poem.content.trim().split(/\n\n+/), [poem.content])

  // 마우스를 따라다니는 푸른 반사광 (Glow)
  const backgroundGlow = useMotionTemplate`radial-gradient(500px circle at ${mouseX}px ${mouseY}px, rgba(120, 160, 255, 0.06), transparent 80%)`
  
  // 스크롤이 끝에 다다르면 화면 전체에 미세한 글리치(깜빡임) 투명도 적용
  const glitchOpacity = useTransform(
    progress,
    [0.85, 0.88, 0.91, 0.94, 0.97, 1],
    [1, 0.8, 1, 0.7, 0.9, 1]
  )

  return (
    <motion.main 
      className="min-h-screen bg-[#07080a] text-[#d1d5db] selection:bg-blue-500/20 relative font-sans overflow-hidden"
      onMouseMove={handleMouseMove}
      style={{ opacity: glitchOpacity }}
    >
      <BackNav />

      {/* 성능 최적화용 전역 CSS Keyframes */}
      <style dangerouslySetInnerHTML={{ __html: `
        @keyframes streamFall {
          0% { transform: translateY(-100vh); }
          100% { transform: translateY(100vh); }
        }
      `}} />

      {/* 마우스 추적 조명 레이어 */}
      <motion.div 
        className="pointer-events-none fixed inset-0 z-0"
        style={{ background: backgroundGlow }}
      />

      {/* 차가운 데이터 스트림 (광섬유) 배경 */}
      <div className="fixed inset-0 pointer-events-none z-0 opacity-60">
        {streams.map((stream) => (
          <div
            key={stream.id}
            className="absolute top-0 bottom-0 bg-gradient-to-b from-transparent via-[#8fb3d9] to-transparent"
            style={{
              left: `${stream.x}%`,
              width: `${stream.width}px`,
              opacity: stream.opacity,
              animation: `streamFall ${stream.duration}s linear infinite`,
              animationDelay: `${stream.delay}s`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>

      {/* 본문 텍스트 */}
      <div className="relative z-10 w-full px-8 pt-[20vh] pb-[40vh] md:pl-[12vw] md:pr-[45vw] max-w-[1400px] mx-auto">
        <header className="mb-[35vh]">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="poem-title font-serif text-4xl md:text-[4rem] leading-[1.2] tracking-tight text-[#e5e7eb]"
          >
            {poem.title}
          </motion.h1>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.2, duration: 1 }}
            className="mt-12 flex items-center gap-4"
          >
            <span className="w-8 h-[1px] bg-current"></span>
            <span className="text-[10px] tracking-[0.5em] uppercase font-mono">System.out.print</span>
          </motion.div>
        </header>

        <div className="space-y-[45vh]">
          {stanzas.map((stanza, i) => (
            <StanzaBlock 
              key={i} 
              stanza={stanza} 
              className="max-w-[420px]" 
              // 차가운 메탈릭 텍스트 느낌을 위한 미세한 그림자
              textShadow="0px 0px 15px rgba(143, 179, 217, 0.15)"
            />
          ))}
        </div>
      </div>
    </motion.main>
  )
}