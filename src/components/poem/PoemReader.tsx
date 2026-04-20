'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Poem } from '@/lib/poems'
import KeyboardHint from '@/components/poem/KeyboardHint'
import { poemSceneMap, DefaultScene } from '@/lib/poem-scene-map'

export default function PoemReader({
  poem,
  allSlugs = [],
}: {
  poem: Poem
  allSlugs?: string[]
}) {
  const router = useRouter()
  const [hintVisible, setHintVisible] = useState(true)

  const idx = allSlugs.indexOf(poem.slug)
  const prevSlug = idx > 0 ? allSlugs[idx - 1] : null
  const nextSlug = idx >= 0 && idx < allSlugs.length - 1 ? allSlugs[idx + 1] : null

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') router.push('/')
      if (e.key === 'ArrowLeft' && prevSlug) router.push(`/poem/${prevSlug}`)
      if (e.key === 'ArrowRight' && nextSlug) router.push(`/poem/${nextSlug}`)
    }

    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [router, prevSlug, nextSlug])

  useEffect(() => {
    const t = setTimeout(() => setHintVisible(false), 3000)
    return () => clearTimeout(t)
  }, [])

  const Scene = poemSceneMap[poem.slug] ?? DefaultScene

  return (
    <>
      <Scene poem={poem} />
      <KeyboardHint
        visible={hintVisible}
        hasPrev={!!prevSlug}
        hasNext={!!nextSlug}
      />
    </>
  )
}