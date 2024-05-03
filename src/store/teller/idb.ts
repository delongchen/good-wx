import Dexie, {Table, TransactionMode, TXWithTables} from "dexie";
import {BookChapterInterface, BookMetaInterface, BookReadingRecord} from "@/types/teller/books";
import * as keys from "@/store/keys";

class BookDb extends Dexie {
  books!: Table<BookMetaInterface>
  chapters!: Table<BookChapterInterface>
  records!: Table<BookReadingRecord>

  constructor() {
    super(keys.teller.bookStore)
    this.version(1).stores({
      books: '&uid',
      chapters: '&key, book',
      records: '&uid'
    })
  }
}

const db = new BookDb()

type TransCallBack<T> = (trans: TXWithTables<BookDb>) => Promise<T> | T

const dbTransactionHelper = (table: Table) => {
  const createApi = (mode: TransactionMode) => {
    return <T>(cb: TransCallBack<T>) => db.transaction(mode, table, cb)
  }
  const r = createApi('r')
  const rw = createApi('rw')
  return {r, rw,}
}

const tranBooks = dbTransactionHelper(db.books)
const tranChapters = dbTransactionHelper(db.chapters)
const tranRecords = dbTransactionHelper(db.records)

/**********************/
/*  actions of books  */
/**********************/
export const getAllBooks = () => tranBooks.r(trans => trans.books.toArray())

export const getBookByUid = async (uid: number) =>
  tranBooks.r(trans => {
    return trans.books.get(uid)
  })

export const insertBook = (meta: BookMetaInterface) =>
  tranBooks.rw(async trans => {
    if (await trans.books.get(meta.uid) === undefined) {
      await trans.books.put(meta)
    }
  })

export const clearBooks = () => tranBooks.rw(trans => trans.books.clear())

export const getChaptersByBook = (uid: number) =>
  tranChapters.r(trans => {
    return trans.chapters
      .where('book')
      .equals(uid)
      .toArray()
  })

/**********************/
/* actions of chapters */
/**********************/
export const getChapterByKey = (key: string) =>
  tranChapters.r(trans => {
    return trans.chapters.get(key)
  })

export const getAllChapters = () => tranChapters.r(trans => trans.chapters.toArray())

export const insertChapter = (chapter: BookChapterInterface) =>
  tranChapters.rw(async trans => {
    await trans.chapters.put(chapter)
  })

export const insertChapters = (chapters: BookChapterInterface[]) =>
  tranChapters.rw(async trans => {
    await trans.chapters.bulkPut(chapters)
  })

export const clearChapters = () => tranChapters.rw(trans => trans.chapters.clear())

/**********************/
/* actions of records */
/**********************/
export const getRecordByUid = (uid: number) =>
  tranRecords.r(trans => {
    return trans.records.get(uid)
  })

export const getAllRecords = () => tranRecords.r(trans => trans.records.toArray())

export const insertRecord = (record: BookReadingRecord) =>
  tranRecords.rw(async trans => {
    await trans.records.put(record)
  })

export const updateRecord = (record: BookReadingRecord) =>
  tranRecords.rw(async trans => {
    await trans.records.update(record.uid, record)
  })

export const clearRecords = () =>
  tranRecords.rw(
    trans => trans.records.clear()
  )

// other actions
export const hasBook = async (uid: number) => {
  return (await getBookByUid(uid)) !== undefined
}
