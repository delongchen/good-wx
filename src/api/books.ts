import {sub} from "@/utils/requests";
import {BookMetaInterface} from "@/types/teller/books";
import * as req from "@/utils/requests.ts";

const api = sub('teller')

const Api = {
  MetaList: api.join('books'),
}

const fmtMeta = (meta: BookMetaInterface) => {
  meta.cover ??= req.join('teller', 'cover', meta.uid)
  meta.collection ??= '今日必读'
  meta.latestRead = {
    chapter: 0,
    paragraph: 0,
    line: 0,
    char: 0,
  }
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
