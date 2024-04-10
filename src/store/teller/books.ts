import {computed, ref, watchEffect} from "vue";
import {BookDetail, BookDetailRaw, BookIndex} from "@/types/teller/books";
import {fetchBookDetailRaw, fetchBookIndexList} from "@/api/teller.ts";

const bookStore = new Map<number, BookDetail>()
export const bookStoreRef = ref(bookStore)

const uid = ref(0)
const setUid = (uidRaw: string | number | null) => {
  if (typeof uidRaw === 'string') {
    uidRaw = +uidRaw
  } else if (uidRaw === null) {
    uidRaw = 0
  }

  if (isNaN(uidRaw)) {
    uidRaw = 0
  }

  if (uid.value === uidRaw) return

  uid.value = uidRaw
}
const book = ref<BookDetailRaw | null>(null)
export const uidWatcher = watchEffect(async () => {
  const bookId = uid.value
  if (bookId === 0) return

  const data = await fetchBookDetailRaw(bookId).catch(() => null)
  if (data === null) {
    book.value = null
    return
  }

  book.value = data
})

export const useBookDetail = () => {
  const isInLib = computed(() => {
    return bookStoreRef.value.has(uid.value)
  })

  const addToLib = () => {
    if (isInLib.value || book.value === null) return
    const _uid = book.value.index.uid
    bookStoreRef.value.set(
      _uid,
      {
        index: book.value.index,
        chapters: book.value.chapters.map((it, i) => ({
          key: `${_uid}-${i}`,
          title: it,
          paragraph: []
        })),
      }
    )
  }

  return {
    isInLib,
    addToLib,
    book,
    uid,
    setUid
  }
}
// todo rebuild store
export const bookIndexListRef = ref<BookIndex[]>([])
export const refreshBookIndexList = async () => {
  bookIndexListRef.value = await fetchBookIndexList()
}

export const getLibList = () => {
  return [...bookStoreRef.value.values()]
}
