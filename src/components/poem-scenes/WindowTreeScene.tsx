'use client'

import { useEffect, useState, useMemo } from 'react'
import { motion, useTransform, useMotionValue, MotionValue } from 'framer-motion'
import type { Poem } from '@/lib/poems'
import BackNav from '@/components/poem/BackNav'
import StanzaBlock from '@/components/poem/StanzaBlock'
import useScrollProgress from '@/hooks/useScrollProgress'

// ------------------------------------------------------------------
// 타입 정의 (바람에 흔들리는 속성들을 데이터 모델에 포함)
// ------------------------------------------------------------------
type LeafData = { 
  id: number; x: number; y: number; r: number; s: number; delay: number; color: string;
  swayDuration: number; swayAmount: number; swayDelay: number;
}
type FlowerData = { 
  id: number; x: number; y: number; s: number; delay: number;
  swayDuration: number; swayAmount: number; swayDelay: number;
}

// ------------------------------------------------------------------
// 자식 컴포넌트: 잎사귀 (Math.random 제거, Props만 사용)
// ------------------------------------------------------------------
function AnimatedLeaf({ progress, leaf }: { progress: MotionValue<number>; leaf: LeafData }) {
  const scale = useTransform(progress, [leaf.delay, leaf.delay + 0.25], [0, leaf.s])
  const opacity = useTransform(progress, [leaf.delay, leaf.delay + 0.15], [0, 0.9])

  return (
    <motion.g style={{ x: leaf.x, y: leaf.y, scale, opacity }}>
      <motion.path
        d="M0,0 C2,-8 8,-12 12,-6 C14,0 6,6 0,0"
        fill={leaf.color}
        initial={{ rotate: leaf.r }}
        animate={{ 
          rotate: [leaf.r - leaf.swayAmount, leaf.r + leaf.swayAmount] 
        }}
        transition={{
          duration: leaf.swayDuration,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: leaf.swayDelay,
        }}
        style={{ transformOrigin: '0px 0px' }}
      />
    </motion.g>
  )
}

// ------------------------------------------------------------------
// 자식 컴포넌트: 꽃 (Math.random 제거, Props만 사용)
// ------------------------------------------------------------------
function AnimatedFlower({ progress, flower }: { progress: MotionValue<number>; flower: FlowerData }) {
  const scale = useTransform(progress, [flower.delay, flower.delay + 0.15], [0, flower.s])
  const opacity = useTransform(progress, [flower.delay, flower.delay + 0.1], [0, 1])

  return (
    <motion.g style={{ x: flower.x, y: flower.y, scale, opacity }}>
      <motion.g
        initial={{ rotate: 0 }}
        animate={{ rotate: [-flower.swayAmount, flower.swayAmount] }}
        transition={{
          duration: flower.swayDuration,
          repeat: Infinity,
          repeatType: 'mirror',
          ease: 'easeInOut',
          delay: flower.swayDelay,
        }}
        style={{ transformOrigin: '0px 0px' }}
      >
        {[0, 72, 144, 216, 288].map((angle) => (
          <circle
            key={angle}
            cx="0"
            cy="-4"
            r="3"
            fill="#f4f1ea"
            transform={`rotate(${angle})`}
            style={{ opacity: 0.85 }}
          />
        ))}
        <circle r="2.5" fill="#d9c8a9" />
      </motion.g>
    </motion.g>
  )
}

// ------------------------------------------------------------------
// 메인 Scene 컴포넌트
// ------------------------------------------------------------------
export default function WindowTreeScene({ poem }: { poem: Poem }) {
  const rawProgress = useScrollProgress()
  const progress = useMotionValue(0)

  // 렌더링 순수성(Purity)을 지키기 위해 랜덤 데이터는 useEffect 내에서 생성하여 상태로 관리
  const [treeData, setTreeData] = useState<{ leaves: LeafData[], flowers: FlowerData[] }>({ leaves: [], flowers: [] })

  useEffect(() => {
    progress.set(rawProgress)
  }, [rawProgress, progress])

  useEffect(() => {
    // 마운트 시 한 번만 랜덤 데이터를 생성합니다. (렌더링 밖이므로 Math.random() 사용 자유로움)
    const clusters = [
      { cx: 40, cy: 150, r: 40 },
      { cx: 160, cy: 100, r: 45 },
      { cx: 55, cy: 60, r: 35 },
      { cx: 140, cy: 50, r: 35 },
      { cx: 100, cy: 100, r: 50 },
      { cx: 80, cy: 200, r: 25 },
      { cx: 120, cy: 140, r: 25 },
    ]

    const generatedLeaves: LeafData[] = []
    const generatedFlowers: FlowerData[] = []
    let leafId = 0
    let flowerId = 0

    clusters.forEach(cluster => {
      // 잎사귀 생성
      const leafCount = Math.floor(15 + Math.random() * 8)
      for (let i = 0; i < leafCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const distanceRatio = Math.sqrt(Math.random()) 
        const radius = distanceRatio * cluster.r
        
        const baseDelay = 0.15 + (Math.random() * 0.1)
        const spreadDelay = distanceRatio * 0.35
        const finalDelay = baseDelay + spreadDelay

        generatedLeaves.push({
          id: leafId++,
          x: cluster.cx + Math.cos(angle) * radius,
          y: cluster.cy + Math.sin(angle) * radius,
          r: Math.random() * 360,
          s: 0.5 + Math.random() * 0.7,
          delay: finalDelay,
          color: ['#8fa38a', '#7a8c76', '#a4b3a1', '#6f826b'][Math.floor(Math.random() * 4)],
          swayDuration: 3.5 + Math.random() * 2.5,
          swayAmount: 3 + Math.random() * 5,
          swayDelay: Math.random() * 2
        })
      }

      // 꽃 생성
      const flowerCount = Math.floor(2 + Math.random() * 3)
      for (let i = 0; i < flowerCount; i++) {
        const angle = Math.random() * Math.PI * 2
        const radius = Math.random() * (cluster.r * 0.7)
        
        generatedFlowers.push({
          id: flowerId++,
          x: cluster.cx + Math.cos(angle) * radius,
          y: cluster.cy + Math.sin(angle) * radius,
          s: 0.5 + Math.random() * 0.5,
          delay: 0.65 + Math.random() * 0.15,
          swayDuration: 4 + Math.random() * 2,
          swayAmount: 2 + Math.random() * 3,
          swayDelay: Math.random() * 2
        })
      }
    })

    setTreeData({ leaves: generatedLeaves, flowers: generatedFlowers })
  }, [])

  const stanzas = useMemo(() => poem.content.trim().split(/\n\n+/), [poem.content])

  // 배경: 어두운 밤에서 생명력 있는 새벽빛으로
  const pageBg = useTransform(progress, [0, 1], ['#0d0c0b', '#1a1d18'])

  const treePaths = [
    "M 90 400 Q 95 250 98 100 L 102 100 Q 105 250 110 400 Z", // 메인 기둥
    "M 95 250 Q 70 230 40 150 L 43 148 Q 72 220 97 240 Z",   // 좌측 큰 가지
    "M 105 180 Q 130 160 160 100 L 157 98 Q 128 150 103 170 Z", // 우측 큰 가지
    "M 98 130 Q 80 100 55 60 L 57 58 Q 82 95 100 120 Z",     // 좌측 상단 잔가지
    "M 101 110 Q 120 90 140 50 L 138 48 Q 118 85 99 105 Z"      // 우측 상단 잔가지
  ]

  return (
    <motion.main 
      className="min-h-screen text-[#ece9e2] selection:bg-white/5 relative overflow-hidden font-sans"
      style={{ backgroundColor: pageBg }}
    >
      <BackNav />

      {/* 우측 하단 나무 배경 연출 */}
      <div className="fixed inset-0 pointer-events-none z-0 flex items-end justify-end opacity-40 md:opacity-100 md:pr-[5vw]">
        <div className="absolute inset-0 opacity-[0.03] bg-[url('/noise.png')] mix-blend-overlay" />
        
        <svg 
          viewBox="0 0 200 400" 
          preserveAspectRatio="xMidYMax meet"
          className="w-[120vw] md:w-[50vw] max-w-[800px] h-[70vh] md:h-[90vh]"
        >
          {/* 기둥 및 가지 */}
          <motion.g
            initial={{ opacity: 0.3 }}
            style={{ opacity: useTransform(progress, [0, 0.4], [0.3, 0.7]) }}
            fill="#3a3732"
          >
            {treePaths.map((path, idx) => (
              <path key={`trunk-${idx}`} d={path} />
            ))}
          </motion.g>

          {/* 잎사귀들 */}
          <g>
            {treeData.leaves.map((leaf) => (
              <AnimatedLeaf key={`leaf-${leaf.id}`} progress={progress} leaf={leaf} />
            ))}
          </g>

          {/* 꽃들 */}
          <g>
            {treeData.flowers.map((flower) => (
              <AnimatedFlower key={`flower-${flower.id}`} progress={progress} flower={flower} />
            ))}
          </g>
        </svg>
      </div>

      {/* 본문 텍스트 */}
      <div className="relative z-10 w-full px-8 pt-[25vh] pb-[40vh] md:pl-[12vw] md:pr-[45vw] max-w-[1400px] mx-auto">
        <header className="mb-[30vh]">
          <motion.h1
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1.4, ease: [0.22, 1, 0.36, 1] }}
            className="poem-title font-serif text-5xl md:text-6xl leading-[1.2]"
          >
            {poem.title}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.3 }}
            transition={{ delay: 1.6 }}
            className="mt-8 text-[10px] tracking-[0.6em] uppercase"
          >
            Spring is coming
          </motion.p>
        </header>

        <div className="space-y-[45vh]">
          {stanzas.map((stanza, i) => (
            <StanzaBlock key={i} stanza={stanza} className="max-w-[380px]" />
          ))}
        </div>
      </div>
    </motion.main>
  )
}