import ManageWorker from './worker?worker'
import {useWxWebWorkerProtocolMain} from "@/utils/worker";
import {getAllBooks, getAllRecords} from "@/store/teller/idb.ts";
import {ref} from "vue";
import {BookMetaInterface, BookReadingRecord} from "@/types/teller/books.ts";

interface BookCacheInfo {
  meta: BookMetaInterface,
  record?: BookReadingRecord,
  chapter?: {
    size: number,
    count: number,
  }
}

const worker: Worker = new ManageWorker

const {invokeTask} = useWxWebWorkerProtocolMain(worker)

const enum CacheManagerStatus {
  Ready,
  Updating,
}

export const useCacheManager = () => {
  const status = ref<CacheManagerStatus>(CacheManagerStatus.Ready)
  const cacheInfoMap = ref<Map<number, BookCacheInfo>>(new Map)
  const notInLibRecords = ref<BookReadingRecord[]>([])
  const notInLibChapters = ref<{uid: number, count: number, size: number}[]>([])

  const clearAllCache = () => invokeTask<void>({ key: 'clear-all' }, {timeout: 2000})

  const updateCacheInfo = async () => {
    if (status.value === CacheManagerStatus.Updating) return

    status.value = CacheManagerStatus.Updating

    const infoMap = new Map<number, BookCacheInfo>()
    const wildRecords: BookReadingRecord[] = []

    const books = await getAllBooks()
    for (const book of books) {
      infoMap.set(book.uid, {meta: book})
    }

    const records = await getAllRecords()
    for (const record of records) {
      const exist = infoMap.get(record.uid)
      if (exist !== undefined) {
        exist.record = record
      } else {
        wildRecords.push(record)
      }
    }

    notInLibRecords.value = wildRecords
    cacheInfoMap.value = infoMap

    invokeTask<{uid: number, count: number, size: number}[] | undefined>(
      {key: 'calculate-chapters'}
    ).then(result => {
      if (result === undefined) return

      notInLibChapters.value = []
      for (const item of result) {
        const exist = cacheInfoMap.value.get(item.uid)
        if (exist !== undefined) {
          exist.chapter = {
            count: item.count,
            size: item.size,
          }
        } else {
          notInLibChapters.value.push(item)
        }
      }
    }).finally(() => { status.value = CacheManagerStatus.Ready })
  }

  return {
    status,
    cacheInfoMap,
    notInLibChapters,
    notInLibRecords,
    clearAllCache,
    updateCacheInfo,
  }
}
