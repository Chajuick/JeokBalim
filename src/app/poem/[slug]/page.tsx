import { getAllPoemSlugs, getPoem } from '@/lib/poems'
import PoemReader from '@/components/PoemReader'

export async function generateStaticParams() {
  const slugs = getAllPoemSlugs()
  return slugs.map((slug) => ({ slug }))
}

export default async function PoemPage({
  params,
}: {
  params: Promise<{ slug: string }>
}) {
  const { slug } = await params
  const poem = await getPoem(slug)
  return <PoemReader poem={poem} />
}
