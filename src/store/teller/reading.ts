import {computed, reactive, watchEffect} from "vue";
import {bookStoreRef} from "@/store/teller/books";
import {BookChapterRaw, BookChapterType, BookDetail, TextParagraph} from "@/types/teller/books";
import {fetchChapters} from "@/api/teller";
import {useLocalStorage} from "@vueuse/core";
import * as keys from '@/store/keys'


const state = reactive<{
  uid: number
}>({
  uid: 0, // uid is 0, it means no book.
})

const history = useLocalStorage(keys.teller.history, {} as Record<number, number>)

const chapterIndex = computed<number>(() => {
  console.log('index call')
  if (state.uid === 0) return 0
  const old = history.value[state.uid]
  // reading history has not been recorded.
  if (old === undefined) {
    history.value[state.uid] = 0
    return 0
  }
  return history.value[state.uid]
})

// if book not found, return null
const curBook = computed<BookDetail | null>(() => {
  const uid = state.uid
  return bookStoreRef.value.get(uid) ?? null
})

const curChapter = computed<BookChapterRaw | null>(() => {
  // case 1. book not found
  if (curBook.value === null) return null
  const chapters = bookStoreRef.value.get(state.uid)!.chapters
  // case 2. chapter not found
  return chapters[chapterIndex.value] ?? null
})

const getChapter = async (index: number) => {
  const chapter = await fetchChapters(state.uid, index)

  if (chapter.length !== 0) {
    bookStoreRef.value.get(state.uid)!
      .chapters[chapterIndex.value] = chapter[0]
  }
}

export const uidWatcher = watchEffect(async () => {
  console.log(`[watcher]: call`)
  const chapter = curChapter.value
  if (chapter === null) return

  if (chapter.paragraph.length === 0) {
    if (chapterIndex.value > curBook.value!.chapters.length) return
    await getChapter(chapterIndex.value)
  }
})

const translateText = (raw: BookChapterRaw | null): BookChapterType | null => {
  if (raw === null) return null

  const paragraphs: TextParagraph[] = raw.paragraph.map(p => {
    return p.map(line => {
      return [{
        text: line
      }]
    })
  })

  return {
    key: raw.key,
    paragraphs,
    title: raw.title,
  }
}

const readingCtx = computed<{
  pre: BookChapterType | null,
  cur: BookChapterType | null,
  next: BookChapterType | null,
}>(() => {
  const cur = curChapter.value
  if (cur === null) {
    return {
      pre: null, cur: null, next: null,
    }
  }

  const preIndex = chapterIndex.value - 1
  const nextIndex = chapterIndex.value + 1

  const pre = curBook.value!.chapters[preIndex] ?? null
  const next = curBook.value!.chapters[nextIndex] ?? null

  return {
    pre: translateText(pre),
    cur: translateText(cur),
    next: translateText(next)
  }
})

const ob = new IntersectionObserver(entries => {
  for (const entry of entries) {
    const id = entry.target.id
    console.log(id, entry.isIntersecting)
  }
})

export const useReading = () => {
  return {
    state,
    chapterIndex,
    curBook,
    curChapter,
    readingCtx,
    ob,
  }
}
