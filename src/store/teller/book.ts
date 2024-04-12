import {defineStore} from "pinia";
import * as keys from '../keys'
import {BookMetaInterface} from "@/types/teller/books";
import {fetchBookMetaList, fetchFullBook} from "@/api/books";
import * as req from '@/utils/requests'
import {ref} from "vue";
import * as db from './idb'

const copy = (source: BookMetaInterface): BookMetaInterface => ({
  ...source,
  tags: Array.from(source.tags),
  mc: {...source.mc},
  counter: {...source.counter}
})

interface BookStoreInterface {
  bookMetaMap: Map<number, BookMetaInterface>
  localBookMap: Map<number, BookMetaInterface>
  activeBookUid: number
}

const emptyBookStore = (): BookStoreInterface => {
  return {
    bookMetaMap: new Map,
    localBookMap: new Map,
    activeBookUid: 0,
  }
}

export const useBookStore = defineStore(keys.teller.bookStore, {
  state: emptyBookStore,
  getters: {
    metaList: state => [...state.bookMetaMap.values()],
    activeBook: state => {
      const uid = state.activeBookUid
      return (
        state.localBookMap.get(uid)
        ??
        state.bookMetaMap.get(uid)
        ??
        null
      )
    },
    localBookList: state => [...state.localBookMap.values()]
  },
  actions: {
    async refreshMetaList() {
      const metaList = await fetchBookMetaList()
      metaList.forEach(it => {
        it.cover ??= req.join('teller', 'cover', it.uid)
        it.latestRead = 0
        this.bookMetaMap.set(it.uid, it)
      })
    },
    async loadLocalBooks() {
      const localBooks = await db.getAllBooks()
      for (const book of localBooks)  {
        this.localBookMap.set(book.uid, book)
      }
    },
    setActiveBook(uid: number) {
      this.activeBookUid = uid
    },
    async saveActiveBook() {
      const activeBook = this.bookMetaMap.get(this.activeBookUid)
      if (activeBook !== undefined) {
        await db.insertBook(copy(activeBook))
      }
    }
  }
})


export const enum DownloadStatus {
  Downloaded,
  Downloading,
  Ready,
  Error,
}

export const useDownloadBook = () => {
  const status = ref<DownloadStatus>(DownloadStatus.Ready)
  const len = ref(0)
  const count = ref(0)
  const store = useBookStore()

  if (store.activeBook === null) {
    status.value = DownloadStatus.Downloaded
  }

  const download = async () => {
    if (status.value !== DownloadStatus.Ready) {
      return
    }

    const res = await fetchFullBook(store.activeBookUid)
    if (res === null) {
      status.value = DownloadStatus.Error
      return
    }

    const reader = res.body?.getReader()
    if (reader === undefined) {
      status.value = DownloadStatus.Error
      return
    }

    status.value = DownloadStatus.Downloading

    len.value = +(res.headers.get('content-length') ?? '0')
    const textDecoder = new TextDecoder()
    let text = ''
    let chunk = await reader.read()
    while (!chunk.done) {
      count.value += chunk.value.length
      text += textDecoder.decode(chunk.value)
      chunk = await reader.read()
    }

    let result: any
    try {
      result = JSON.parse(text)
    } catch (e: any) {
      status.value = DownloadStatus.Error
      return
    }

    const meta = result.meta as BookMetaInterface
    const chapters: {title: string, paragraphs: string[][]}[] = result.chapters

    await db.insertChapters(
      chapters.map((chapter, index) => {
        return {
          key: `${meta.uid}-${index}`,
          paragraphs: chapter.paragraphs,
          title: chapter.title,
          book: meta.uid
        }
      })
    )
    await store.saveActiveBook()
    status.value = DownloadStatus.Downloaded
  }

  return {
    download,
    status,
    len,
    count,
  }
}
