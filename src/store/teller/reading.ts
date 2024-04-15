import {BookChapterInterface, BookCounterInterface, BookMetaInterface} from "@/types/teller/books.ts";
import {getBookByUid, getChapterByKey, insertBook, insertChapter, updateBook} from "@/store/teller/idb.ts";
import {fetchBookMeta, fetchChapter} from "@/api/books.ts";
import {useRoute} from "vue-router";
import {computed, ref} from "vue";

const EmptyCounter: BookCounterInterface = {
  chapter: 0,
  paragraph: 0,
  line: 0,
  char: 0,
}

const EmptyBookMeta: BookMetaInterface = {
  name: '',
  author: '',
  uid: 0,
  tags: [],
  summary: '',
  timestamp: 0,
  collection: '',
  mc: {},
  counter: EmptyCounter,
  latestRead: EmptyCounter
}

const getAndCacheChapter = async (book: number, index: number): Promise<BookChapterInterface | null> => {
  if (book === 0 || index < 0) return null

  const local = await getChapterByKey(`${book}-${index}`)
  if (local !== undefined) {
    return local
  }

  const remote = await fetchChapter(book, index)
  if (remote !== null) {
    await insertChapter(remote)
    return remote
  }

  return null
}

export const useReading = () => {
  const route = useRoute()
  const uid = computed(() => +(route.query?.uid ?? 0))
  const book = ref<BookMetaInterface>(EmptyBookMeta)
  const chapterList = ref<BookChapterInterface[]>([])

  const hasNext = computed<boolean>(() => {
    if (book.value.uid === 0) return false

    const history = book.value.latestRead
    const counter = book.value.counter

    return history.chapter < counter.chapter - 1
  })

  const hasPrev = computed<boolean>(() => {
    return book.value.uid !== 0 && book.value.latestRead.chapter >= 1
  })

  const getChapter = async (index: number) => {
    if (
      book.value.uid === 0 ||
      index < 0 ||
      index >= book.value.counter.chapter
    ) return null

    return getAndCacheChapter(book.value.uid, index)
  }

  const nextChapter = async () => {
    if (book.value.uid === 0) return
    const next = await getChapter(book.value.latestRead.chapter + 1)
    if (next !== null) {
      chapterList.value.push(next)
      book.value.latestRead.chapter += 1
    }
  }

  const init = async () => {
    if (uid.value === 0) return

    let meta = await getBookByUid(uid.value) ?? null
    if (meta === null) {
      meta = await fetchBookMeta(uid.value)
      if (meta !== null) {
        await insertBook(meta)
      }
    }

    if (meta === null) {
      return
    }

    book.value = meta
    const latest = await getChapter(book.value.latestRead.chapter)
    if (latest !== null) {
      chapterList.value.push(latest)
    }
  }

  return {
    book,
    hasNext,
    chapterList,
    hasPrev,
    init,
    nextChapter,
  }
}
