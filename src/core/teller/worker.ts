import {useWxWebWorkerProtocolWorker} from "@/utils/worker";

import {
  clearRecords,
  clearBooks,
  clearChapters,
  getAllChapters,
} from '@/store/teller/idb'

const { registerHandler, messageHandler } = useWxWebWorkerProtocolWorker()

onmessage = messageHandler

registerHandler('clear-all', async () => {
  await clearChapters()
  await clearRecords()
  await clearBooks()
})

registerHandler('calculate-chapters', async () => {
  const chapters = await getAllChapters()
  const countMap = new Map<number, {
    uid: number,
    size: number,
    count: number,
  }>()

  chapters.forEach(chapter => {
    let size = 0

    for (const lines of chapter.paragraphs) {
      for (const line of lines) {
        size += line.length
      }
    }

    const exist = countMap.get(chapter.book)
    if (exist === undefined) {
      countMap.set(chapter.book, {
        size,
        uid: chapter.book,
        count: 1,
      })
    } else {
      exist.size += size
      exist.count += 1
    }
  })

  return [...countMap.values()]
})
