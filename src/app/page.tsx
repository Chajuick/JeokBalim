import { getAllPoems } from '@/lib/poems'
import PoemList from '@/components/poem/PoemList'

export default function Home() {
  const poems = getAllPoems()
  return <PoemList poems={poems} />
}
