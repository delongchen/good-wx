<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import { DownloadIcon, TaskAddIcon, ChevronRightIcon } from 'tdesign-icons-vue-next'
import {fmtCharNum} from "./utils";
import WxCard from "@/components/wx/WxCard.vue";
import BookNotFound from "@/pages/teller/components/BookNotFound.vue";
import {useDownloadBook, DownloadStatus, selectedMeta} from "@/store/teller/shop";
import {computed, ref} from "vue";
import {BookMetaInterface} from "@/types/teller/books";
import {fetchBookMeta} from "@/api/books";
import {useRoute, useRouter} from "vue-router";
import {hasBook, insertBook} from "@/store/teller/idb";

const route = useRoute()

const book = ref<BookMetaInterface | null>(null)
const localSaved = ref(false)

const copyMeta = (source: BookMetaInterface): BookMetaInterface => ({
  ...source,
  tags: Array.from(source.tags),
  mc: {...source.mc},
  counter: {...source.counter},
  latestRead: {...source.latestRead},
})

const {
  download: _download,
  status,
  len,
  count
} = useDownloadBook()

const downloadText = computed<string>(() => {
  switch (status.value) {
    case DownloadStatus.Downloaded: {
      return '已下载'
    }
    case DownloadStatus.Downloading: {
      const _len = len.value
      if (isNaN(_len) || _len === 0) return '正在下载'
      return `${((count.value / _len) * 100) >> 0}%`
    }
    case DownloadStatus.Error: {
      return '请重试'
    }
    case DownloadStatus.Ready: {
      return '下载'
    }
  }
})


const saveToLocal = async () => {
  if (book.value === null || localSaved.value) {
    return
  }

  await insertBook(copyMeta(book.value))

  localSaved.value = true
}

const download = async () => {
  if (book.value === null) {
    return
  }

  if (!localSaved.value) {
    await saveToLocal()
  }

  await _download(book.value.uid)
}

const initDetail = async () => {
  let meta = selectedMeta.value
  if (meta === null) {
    meta = await fetchBookMeta(+(route.query?.uid ?? 0))
  }
  book.value = meta

  if (meta === null) {
    return
  }

  localSaved.value = await hasBook(meta.uid)
}


const router = useRouter()
const goRead = (uid: number) => {
  router.push({
    name: 'reading',
    query: { uid }
  })
}

initDetail()
</script>

<template>
  <teller-sub-layout
    show-header
    show-footer
  >
    <div
      v-if="book !== null"
      style="padding: 10px;"
    >
      <div class="book-detail-header">
        <div class="header-cover">
          <img :src="book.cover" :alt="book.name">
        </div>
        <div class="header-text">
          <div class="header-text-title">{{book.name}}</div>
          <div class="header-text-author">{{book.author}}</div>
          <div class="header-text-char">{{fmtCharNum(book.counter.char)}}字</div>
        </div>
      </div>

      <wx-card
        title="简介: "
        title-size="larger"
        class="book-detail-card"
      >
        <template #content>
          <div>{{book.summary}}</div>
        </template>
      </wx-card>

      <wx-card
        title="目录"
        title-size="larger"
        header-margin="0"
        class="book-detail-card"
      >
        <template #actions>
          <div style="display: flex; align-items: center; color: #6d6e6f">
            <span>{{book.counter.chapter}}章</span>
            <chevron-right-icon size="larger"/>
          </div>
        </template>
      </wx-card>
    </div>

    <book-not-found v-else/>

    <template #bar>
      <div
        class="book-detail-actions"
        v-if="book !== null"
      >
        <div
          class="book-detail-action"
          @click="download"
          :style="{
            color: status === 0 ? '#aeafaf' : ''
          }"
        >
          <div class="action-icon">
            <download-icon/>
          </div>
          <div class="action-text">{{downloadText}}</div>
        </div>
        <div
          class="book-detail-action"
          @click="saveToLocal"
          :style="{
            color: localSaved ? '#aeafaf' : ''
          }"
        >
          <div class="action-icon">
            <task-add-icon/>
          </div>
          <div class="action-text">
            {{localSaved ? '已添加': '加书架'}}
          </div>
        </div>
        <div
          class="book-detail-actions"
          @click="() => { goRead(book!.uid) }"
        >
          <div
            :style="{
              border: '1px solid black',
              padding: '10px',
              borderRadius: '4px',
              cursor: 'pointer',
            }"
          >立即阅读</div>
        </div>
      </div>
    </template>
  </teller-sub-layout>
</template>

<style scoped lang="less">
.book-detail-header {
  display: flex;

  .header-cover {
    width: 30vw;
    margin-right: 10px;
    img {
      border-radius: 10px;
      width: 100%;
      height: 100%;
    }
  }

  .header-text {
    display: flex;
    flex-direction: column;
    justify-content: space-around;

    .header-text-title {
      font-size: x-large;
      font-weight: bold;
    }

    .header-text-char {
      color: #6d6e6f;
    }
  }
}

.book-detail-card {
  margin-top: 10px;
  background-color: white;
}

.book-detail-actions {
  height: 100%;
  display: flex;
  justify-content: space-around;
  align-items: center;
  background-color: white;

  .book-detail-action {
    display: flex;
    flex-direction: column;
    align-items: center;
    .action-icon {
      font-size: x-large;
    }
    .action-text {
      font-size: small;
    }
  }
}
</style>
