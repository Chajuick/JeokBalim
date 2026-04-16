import fs from 'fs'
import path from 'path'
import matter from 'gray-matter'
import { remark } from 'remark'
import html from 'remark-html'

const poemsDirectory = path.join(process.cwd(), 'poems')

export interface PoemMeta {
  slug: string
  title: string
  date: string
  mood: string
  tags: string[]
  preview: string
}

export interface Poem extends PoemMeta {
  content: string
  contentHtml: string
}

export function getAllPoemSlugs(): string[] {
  const fileNames = fs.readdirSync(poemsDirectory)
  return fileNames
    .filter((name) => name.endsWith('.md'))
    .map((name) => name.replace(/\.md$/, ''))
    .sort()
}

export function getAllPoems(): PoemMeta[] {
  const slugs = getAllPoemSlugs()
  return slugs
    .map((slug) => {
      const fullPath = path.join(poemsDirectory, `${slug}.md`)
      const fileContents = fs.readFileSync(fullPath, 'utf8')
      const { data } = matter(fileContents)
      return {
        slug,
        title: data.title as string,
        date: data.date as string,
        mood: data.mood as string,
        tags: (data.tags as string[]) || [],
        preview: (data.preview as string) || '',
      }
    })
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
}

export async function getPoem(slug: string): Promise<Poem> {
  const fullPath = path.join(poemsDirectory, `${slug}.md`)
  const fileContents = fs.readFileSync(fullPath, 'utf8')
  const { data, content } = matter(fileContents)

  const processedContent = await remark().use(html).process(content)
  const contentHtml = processedContent.toString()

  return {
    slug,
    title: data.title as string,
    date: data.date as string,
    mood: data.mood as string,
    tags: (data.tags as string[]) || [],
    preview: (data.preview as string) || '',
    content,
    contentHtml,
  }
}
