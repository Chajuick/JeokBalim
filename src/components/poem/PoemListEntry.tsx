'use client'

import { motion } from 'framer-motion'
import Link from 'next/link'
import { useState } from 'react'
import type { PoemMeta } from '@/lib/poems'

// 1. 시적 감정에 맞춘 확장된 고급 팔레트
const moodAccent: Record<string, string> = {
  성찰: '#b8a9d9', // Muted Purple
  위로: '#8fb3d9', // Soft Blue
  그리움: '#d9bc8a', // Warm Gold/Sand
  사랑: '#d9a9b1', // Dusty Rose
  슬픔: '#8c9ba8', // Slate Blue
  고독: '#99a19c', // Sage Gray
  기쁨: '#e6ce95', // Warm Sunlight
  분노: '#c28b8b', // Muted Red
  희망: '#a6c4b1', // Mint Green
  허무: '#b5b5b5', // Ash Gray
  평화: '#abbfc2', // Soft Cyan
  자연: '#9eb596', // Muted Olive
  회상: '#d1bda1', // Sepia
  결의: '#a3a8b5', // Steel Blue
  후회: '#948b9c', // Dusky Plum
}

// 2. 사전에 없는 새로운 감정을 위한 예비 팔레트 (적바림 톤앤매너 유지)
const fallbackPalette = [
  '#a8bfa1', // Pale Sage
  '#bcaebf', // Pale Mauve
  '#a3b5c7', // Pale Slate
  '#d1c1a5', // Pale Sand
  '#bdaaa3', // Pale Terra
  '#9ba89f', // Pale Mint
]

// 3. 감정 단어를 분석하여 항상 일정한 색상을 반환하는 함수
function getAccentColor(mood: string) {
  if (!mood) return '#f0ede8' // 감정이 없을 경우 기본색

  // 사전에 정의된 감정이면 해당 색상 반환
  if (moodAccent[mood]) return moodAccent[mood]

  // 정의되지 않은 감정이면 글자를 숫자로 변환(Hash)하여 예비 팔레트에서 선택
  let hash = 0
  for (let i = 0; i < mood.length; i++) {
    hash = mood.charCodeAt(i) + ((hash << 5) - hash)
  }
  
  const index = Math.abs(hash) % fallbackPalette.length
  return fallbackPalette[index]
}

export default function PoemListEntry({
  poem,
  index,
}: {
  poem: PoemMeta
  index: number
}) {
  const [active, setActive] = useState(false)
  
  // 확장된 함수를 통해 색상을 가져옵니다.
  const accent = getAccentColor(poem.mood)

  return (
    <motion.div
      initial={{ opacity: 0, y: 50 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: '-80px' }}
      transition={{ duration: 0.9, delay: index * 0.05, ease: [0.22, 1, 0.36, 1] }}
    >
      <Link
        href={`/poem/${poem.slug}`}
        className="group block py-14 border-b border-white/[0.06] cursor-pointer focus:outline-none"
        onMouseEnter={() => setActive(true)}
        onMouseLeave={() => setActive(false)}
        onFocus={() => setActive(true)}
        onBlur={() => setActive(false)}
      >
        <div className="flex items-baseline justify-between mb-3">
          <span className="text-[11px] tracking-[0.35em] opacity-40">
            {new Date(poem.date).getFullYear()}
          </span>

          <span className="flex items-center gap-2 text-[11px] tracking-[0.3em] opacity-40">
            <span
              className="inline-block w-1.5 h-1.5 rounded-full transition-colors duration-700"
              style={{ backgroundColor: accent }}
            />
            {poem.mood}
          </span>
        </div>

        <h2
          className="poem-title font-serif leading-[1.22] transition-colors duration-700"
          style={{
            fontSize: 'clamp(2.8rem, 7vw, 6rem)',
            color: active ? accent : '#f0ede8',
          }}
        >
          {poem.title}
        </h2>

        <p className="poem-text mt-4 font-serif text-sm leading-relaxed opacity-30 md:hidden">
          {poem.preview}
        </p>

        <motion.p
          animate={{ opacity: active ? 0.35 : 0, y: active ? 0 : 6 }}
          transition={{ duration: 0.4, ease: 'easeOut' }}
          className="poem-text mt-4 font-serif text-sm leading-relaxed hidden md:block"
        >
          {poem.preview}
        </motion.p>
      </Link>
    </motion.div>
  )
}