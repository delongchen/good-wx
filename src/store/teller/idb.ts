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
  return db.books.toArray()
}

export const insertBook = async (meta: BookMetaInterface) => {

}

export const getChapterByBook = async (uid: number) => {
  return db.chapters
    .where('book')
    .equals(uid)
    .toArray()
}

export const getChapterByKey = async (key: string) => {
  return db.chapters.get(key)
}

export const insertChapters = async (chapters: BookChapterInterface[]) => {

}
