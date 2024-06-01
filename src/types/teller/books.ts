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

export interface TellerRuleReplacement {
  value: string | null
  classes: number[]
}

export interface TellerRuleMeta {
  name: string
  uid: number
  desc: string
  latest: number
}

export interface TellerRuleRaw extends TellerRuleMeta {
  entries: [string, TellerRuleReplacement][]
}
