import {sub} from "@/utils/requests";
import {BookChapterInterface, BookMetaInterface} from "@/types/teller/books";
import * as req from "@/utils/requests.ts";

const api = sub('teller')

const Api = {
  MetaList: api.join('books'),
}

const fmtMeta = (meta: BookMetaInterface) => {
  meta.cover ??= req.join('teller', 'cover', meta.uid)
  meta.collection ??= '今日必读'
}

export const fetchBookMetaList = async (): Promise<BookMetaInterface[]> => {
  return fetch(Api.MetaList)
    .then(res => res.json() as Promise<BookMetaInterface[]>)
    .then(list => {
      list.forEach(fmtMeta)
      return list
    })
    .catch(() => [])
}

export const fetchBookMeta = (uid: number) => fetch(api.join('meta', uid))
  .then(res => res.json() as Promise<BookMetaInterface>)
  .then(meta => {
    fmtMeta(meta)
    return meta
  })
  .catch(() => null)

export const fetchFullBook = (uid: number) => fetch(api.join('book', uid)).catch(() => null)

export const fetchChapter = async (key: string) => {
  const [book, index] = key.split('-').map(it => +it)

  if ([book, index].some(isNaN)) return null

  return fetch(api.join('chapter', book, index))
    .then(res => res.json() as Promise<BookChapterInterface>)
    .then(chapter => {
      chapter.book = book
      chapter.key = `${book}-${index}`
      return chapter
    })
    .catch(() => null)
}
