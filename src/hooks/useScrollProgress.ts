'use client'

import { useEffect, useState } from 'react'

export default function useScrollProgress() {
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const onScroll = () => {
      const el = document.documentElement
      const value = el.scrollHeight - el.clientHeight
      setProgress(value > 0 ? el.scrollTop / value : 0)
    }

    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  return progress
}