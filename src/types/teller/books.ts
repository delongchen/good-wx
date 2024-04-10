export interface BookInfo {
  sum: string
  counter: {
    paragraph: number
    line: number
    char: number
  }
}

export interface BookIndex {
  name: string
  author: string
  uid: number
  info: BookInfo
  timestamp: number
  cover?: string
}

export interface BookChapterRaw {
  title: string,
  key: string,
  paragraph: string[][],
}

interface TextChunk {
  text: string
}
type TextLine = TextChunk[]
export type TextParagraph = TextLine[]

export interface BookChapterType {
  key: string,
  title: string,
  paragraphs: TextParagraph[]
}

export interface BookDetailRaw {
  index: BookIndex,
  chapters: string[]
}

export interface BookDetail {
  index: BookIndex,
  chapters: BookChapterRaw[]
}
