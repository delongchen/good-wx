import {
  BookChapterInterface,
  BookCounterInterface,
  BookMetaInterface,
  BookReadingRecord
} from "@/types/teller/books";

export const EmptyCounter: BookCounterInterface = {
  chapter: 0,
  paragraph: 0,
  line: 0,
  char: 0,
}

export const EmptyBookMeta: BookMetaInterface = {
  name: '',
  author: '',
  uid: 0,
  tags: [],
  summary: '',
  timestamp: 0,
  collection: '',
  mc: {},
  counter: EmptyCounter,
}

export const EmptyChapter: BookChapterInterface = {
  key: '',
  book: 0,
  title: '',
  paragraphs: [],
}

export const EmptyReadingRecord: BookReadingRecord = {
  uid: 0,
  chapter: -1,
  title: '',
  line: 0,
  paragraph: 0
}
