import {BookChapter, BookDetailRaw, BookIndex} from "@/types/teller/books";

const BASE = 'http://localhost:11451/teller'
const base = (...sub: (string | number | undefined)[]) => [BASE, ...sub].join('/')

export const getCoverUrl = (index: BookIndex | undefined) => {
  if (index === undefined) return ''

  if (
    index.cover !== undefined &&
    index.cover.startsWith('http')
  ) {
    return index.cover
  }

  return `${BASE}/cover/${index.uid}`
}

export const fetchBookIndexList =
  () => fetch(base('index-list'))
    .then(res => res.json() as Promise<BookIndex[]>)

export const fetchBookDetailRaw =
  (id: number) => fetch(base('book-detail', id))
    .then(res => res.json() as Promise<BookDetailRaw>)

export const fetchChapters =
  (id: number, index?: number) => fetch(base('chapters', id, index))
    .then(res => res.json() as Promise<BookChapter[]>)
