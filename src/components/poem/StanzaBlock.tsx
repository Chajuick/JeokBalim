'use client'

import { motion } from 'framer-motion'

export default function StanzaBlock({
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
          className="poem-text font-serif text-[1.15rem] leading-[2.4] text-[#e8e4de]"
          style={textShadow ? { textShadow } : undefined}
        >
          {line}
        </motion.p>
      ))}
    </motion.div>
  )
}