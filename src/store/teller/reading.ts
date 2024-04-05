import {computed, reactive, watchEffect} from "vue";
import {bookStoreRef} from "@/store/teller/books";
import {BookChapterRaw, BookChapterType, BookDetail, TextParagraph} from "@/types/teller/books";
import {fetchChapters} from "@/api/teller";
import {useLocalStorage} from "@vueuse/core";
import * as keys from '@/store/keys'


const state = reactive<{
  uid: number
}>({
  uid: 0,
})

const history = useLocalStorage(keys.teller.history, {} as Record<number, number>)

const chapterIndex = computed<number>(() => {
  return history.value[state.uid] ?? 0
})

const curBook = computed<BookDetail | null>(() => {
  const uid = state.uid
  return bookStoreRef.value.get(uid) ?? null
})

const curChapter = computed<BookChapterRaw | null>(() => {
  if (curBook.value === null) return null
  const chapters = bookStoreRef.value.get(state.uid)!.chapters
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

const curText = computed<BookChapterType| null>(() => {
  const target = curChapter.value
  if (target === null) return null

  const paragraphs: TextParagraph[] = target.paragraph.map(p => {
    return p.map(line => {
      return [{
        text: line
      }]
    })
  })

  return {
    paragraphs,
    title: target.title,
  }
})

export const useReading = () => {
  return {
    state,
    curText,
  }
}
