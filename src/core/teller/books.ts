export interface BookCounterInterface {
  chapter: number
  paragraph: number
  line: number
  char: number
}

export interface BookChapterInterface {
  title: string
  paragraphs: string[][]
}

export interface BookMetaInterface {
  cover?: string
  name: string
  author: string
  uid: number
  tags: string[]
  summary: string
  timestamp: number
  mc: Record<string, string>
  counter: BookCounterInterface
}

export interface BookInterface {
  meta: BookMetaInterface
  chapters: BookChapterInterface[]
}
