export interface BookCounterInterface {
  chapter: number
  paragraph: number
  line: number
  char: number
}

export interface BookChapterInterface {
  key: string
  book: number
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
  collection: string
  latestRead: BookCounterInterface
  mc: Record<string, string>
  counter: BookCounterInterface
}
