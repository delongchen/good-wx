import {
  BookChapterInterface,
  BookMetaInterface,
  BookReadingRecord
} from "@/types/teller/books.ts";
import {
  getBookByUid,
  getChapterByKey,
  getRecordByUid,
  insertBook,
  insertChapter,
  insertRecord, updateRecord
} from "@/store/teller/idb.ts";
import {fetchBookMeta, fetchChapter} from "@/api/books.ts";
import {computed, ref, watch} from "vue";
import {useLocalStorage} from "@vueuse/core";
import * as keys from '@/store/keys'
import {defaultTheme, ReadingThemeInterface, themeMap} from "@/store/teller/themes.ts";
import {EmptyBookMeta, EmptyChapter, EmptyReadingRecord} from "@/store/teller/empty.ts";
import {ElementPosition} from "@/utils/el.ts";

const getAndCacheChapter = async (chapterKey: string): Promise<BookChapterInterface | null> => {
  const local = await getChapterByKey(chapterKey)
  if (local !== undefined) {
    return local
  }

  const remote = await fetchChapter(chapterKey)
  if (remote !== null) {
    await insertChapter(remote)
    return remote
  }

  return null
}

export const enum BookStatus {
  Ready,
  Loading,
  NotFound,
}

export const useBook = (uidGetter: () => number) => {
  const book = ref<BookMetaInterface>(EmptyBookMeta)
  const status = ref<BookStatus>(BookStatus.NotFound)
  const record = ref<BookReadingRecord>(EmptyReadingRecord)
  const chapterList = ref<string[]>([])

  const handleNextChapter = () => {
    const key = `${book.value.uid}-${record.value.chapter + 1}`
    chapterList.value.push(key)
  }

  const handleChapterPosition = async (key: string, value: ElementPosition, title: string) => {
    if (record.value.uid === 0) return

    if (value === ElementPosition.BodyInView) {
      const [, chapterIndex] = key.split('-').map(it => +it)
      record.value.chapter = chapterIndex
      record.value.title = title
      await updateRecord(record.value)
    }
  }

  watch(
    uidGetter,
    async value => {
      status.value = BookStatus.NotFound

      if (isNaN(value) || value === 0) {
        return
      }

      status.value = BookStatus.Loading

      let meta = await getBookByUid(value) ?? null
      if (meta === null) {
        meta = await fetchBookMeta(value)
        if (meta !== null) {
          await insertBook(meta)
        }
      }
      if (meta === null) {
        status.value = BookStatus.NotFound
        return
      }
      book.value = meta

      const localRecord = await getRecordByUid(value)
      if (localRecord === undefined) {
        const newRecord: BookReadingRecord = {
          uid: value,
          chapter: -1,
          title: '',
          paragraph: 0,
          line: 0,
        }
        await insertRecord(newRecord)
        record.value = newRecord
      } else {
        record.value = localRecord
      }

      if (record.value.chapter !== -1) {
        chapterList.value.push(`${value}-${record.value.chapter}`)
      }

      status.value = BookStatus.Ready
    },
    { immediate: true }
  )

  return {
    book,
    status,
    record,
    chapterList,
    handleNextChapter,
    handleChapterPosition,
  }
}

export const useChapter = (keyGetter: () => string) => {
  const status = ref<BookStatus>(BookStatus.NotFound)
  const chapter = ref<BookChapterInterface>(EmptyChapter)

  watch(
    keyGetter,
    async value => {
      status.value = BookStatus.NotFound

      if (value === '') return

      status.value = BookStatus.Loading
      const result = await getAndCacheChapter(value)
      if (result === null) {
        status.value = BookStatus.NotFound
        return
      }

      chapter.value = result
      status.value = BookStatus.Ready
    },
    {immediate: true}
  )

  return {
    status,
    chapter,
  }
}

interface ReadingSettingInterface {
  fontSize: number
  themeName: string
}

const initSetting = (): ReadingSettingInterface => {
  return {
    fontSize: 22,
    themeName: 'light'
  }
}

const localSetting = useLocalStorage(
  keys.teller.readingSetting,
  initSetting,
  {
    mergeDefaults: true
  }
)

export const useReadingSetting = () => {
  const setFontSize = (size: number) => {
    localSetting.value.fontSize = size
  }

  const fontSize = computed(() => localSetting.value.fontSize)

  const setThemeName = (theme: string) => {
    localSetting.value.themeName = theme
  }

  const theme = computed<ReadingThemeInterface>(() => {
    const exist = themeMap.get(localSetting.value.themeName)
    return exist ?? defaultTheme
  })

  return {
    setFontSize,
    setThemeName,
    fontSize,
    theme,
  }
}
