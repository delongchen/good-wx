import Dexie, { Table } from 'dexie'
import * as keys from '@/store/keys'
import {BookChapterInterface, BookMetaInterface} from "@/types/teller/books";

class BookDb extends Dexie {
  books!: Table<BookMetaInterface>
  chapters!: Table<BookChapterInterface>

  constructor() {
    super(keys.teller.bookStore)
    this.version(1).stores({
      books: '&uid',
      chapters: '&key'
    })
  }
}

export const db = new BookDb()
