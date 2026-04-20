'use client'

import { motion } from 'framer-motion'

export default function KeyboardHint({
  visible,
  hasPrev,
  hasNext,
}: {
  visible: boolean
  hasPrev: boolean
  hasNext: boolean
}) {
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