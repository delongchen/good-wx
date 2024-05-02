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

export interface BookReadingRecord {
  uid: number
  title: string
  chapter: number
  paragraph: number
  line: number
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
  mc: Record<string, string>
  counter: BookCounterInterface
}
