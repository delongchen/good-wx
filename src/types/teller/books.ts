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

export interface BookDetailRaw {
  index: BookIndex,
  chapters: string[]
}

export interface BookChapterRaw {
  title: string,
  paragraph: string[][]
}

export interface BookDetail {
  index: BookIndex,
  history: number,
  chapters: BookChapterRaw[]
}

interface TextChunk {
  text: string
}
type TextLine = TextChunk[]
export type TextParagraph = TextLine[]

export interface BookChapterType {
  title: string,
  paragraphs: TextParagraph[]
}
