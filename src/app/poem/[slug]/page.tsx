import type { Metadata } from 'next'
import { getAllPoemSlugs, getPoem } from '@/lib/poems'
import PoemReader from '@/components/poem/PoemReader'

export async function generateStaticParams() {
  const slugs = getAllPoemSlugs()
  return slugs.map((slug) => ({ slug }))
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>
}): Promise<Metadata> {
  const { slug } = await params
  const poem = await getPoem(slug)
  return {
    title: `${poem.title} — 적바림`,
    description: poem.preview ?? '짧고 선명한 시. 적바림.',
    openGraph: {
      title: `${poem.title} — 적바림`,
      description: poem.preview ?? '짧고 선명한 시. 적바림.',
      type: 'article',
    },
    twitter: {
      card: 'summary',
      title: `${poem.title} — 적바림`,
      description: poem.preview ?? '짧고 선명한 시. 적바림.',
    },
  }
}

export default async function PoemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const allSlugs = getAllPoemSlugs()
  const poem = await getPoem(slug)
  return <PoemReader poem={poem} allSlugs={allSlugs} />
}
