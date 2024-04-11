import {sub} from "@/utils/requests";
import {BookMetaInterface} from "@/types/teller/books";

const api = sub('teller')

const Api = {
  MetaList: api.join('books'),
}

export const fetchBookMetaList = async (): Promise<BookMetaInterface[]> => {
  return fetch(Api.MetaList)
    .then(res => res.json())
    .catch(() => [])
}

export const fetchFullBook = (uid: number) => fetch(api.join('book', uid)).catch(() => null)
