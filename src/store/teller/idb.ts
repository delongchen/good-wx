import Dexie, {Table} from "dexie";
import {BookChapterInterface, BookMetaInterface} from "@/types/teller/books";
import * as keys from "@/store/keys";

class BookDb extends Dexie {
  books!: Table<BookMetaInterface>
  chapters!: Table<BookChapterInterface>

  constructor() {
    super(keys.teller.bookStore)
    this.version(1).stores({
      books: '&uid',
      chapters: '&key, book'
    })
  }
}

const db = new BookDb()

export const getAllBooks = async () => {
  return db.transaction('r', db.books, async () => {
    return db.books.toArray()
  })
}

export const insertBook = async (meta: BookMetaInterface) => {
  return db.transaction('rw', db.books, async () => {
    const exist = await db.books.get(meta.uid)
    if (exist === undefined) {
      await db.books.put(meta)
    }
  })
}

export const getChapterByBook = async (uid: number) => {
  return db.transaction('r', db.chapters, async () => {
    return db.chapters
      .where('book')
      .equals(uid)
      .toArray()
  })
}

export const getChapterByKey = async (key: string) => {
  return db.transaction('r', db.chapters, async () => {
    return db.chapters.get(key)
  })
}

export const insertChapters = async (chapters: BookChapterInterface[]) => {
  return db.transaction('rw', db.chapters, async () => {
    return db.chapters.bulkPut(chapters)
  })
}

export const getBookByUid = async (uid: number) => {
  return db.transaction('r', db.books, async () => {
    return db.books.get(uid)
  })
}

export const hasBook = async (uid: number) => {
  return (await getBookByUid(uid)) !== undefined
}
