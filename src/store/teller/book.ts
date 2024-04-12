import {BookMetaInterface} from "@/types/teller/books";
import {fetchFullBook} from "@/api/books";
import {ref} from "vue";
import * as db from './idb'


export const enum DownloadStatus {
  Downloaded,
  Downloading,
  Ready,
  Error,
}

export const selectedMeta = ref<BookMetaInterface | null>(null)

export const useDownloadBook = () => {
  const status = ref<DownloadStatus>(DownloadStatus.Ready)
  const len = ref(0)
  const count = ref(0)

  const download = async (uid: number) => {
    if (uid === 0) return

    if (
      status.value !== DownloadStatus.Ready &&
      status.value !== DownloadStatus.Error
    ) {
      return
    }

    const res = await fetchFullBook(uid)
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
    status.value = DownloadStatus.Downloaded
  }

  return {
    download,
    status,
    len,
    count,
  }
}
