<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import { DownloadIcon, TaskAddIcon, ChevronRightIcon } from 'tdesign-icons-vue-next'
import {fmtCharNum} from "./utils";
import WxCard from "@/components/wx/WxCard.vue";
import BookNotFound from "@/pages/teller/components/BookNotFound.vue";
import { useBookStore, useDownloadBook, DownloadStatus } from "@/store/teller/book";
import {computed} from "vue";

const store = useBookStore()

const localSaved = computed(() => {
  const activeBook = store.activeBook
  return store.localBookMap.has(activeBook?.uid ?? 0)
})

const saveLocal = () => {
  if (
    store.activeBook !== null &&
    !localSaved.value
  ) {
    store.saveActiveBook()
  }
}

const {
  download,
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
</script>

<template>
  <teller-sub-layout>
    <div
      v-if="store.activeBook !== null"
      style="padding: 10px;"
    >
      <div class="book-detail-header">
        <div class="header-cover">
          <img :src="store.activeBook.cover" :alt="store.activeBook.name">
        </div>
        <div class="header-text">
          <div class="header-text-title">{{store.activeBook.name}}</div>
          <div class="header-text-author">{{store.activeBook.author}}</div>
          <div class="header-text-char">{{fmtCharNum(store.activeBook.counter.char)}}字</div>
        </div>
      </div>

      <wx-card
        title="简介: "
        title-size="larger"
        class="book-detail-card"
      >
        <template #content>
          <div>{{store.activeBook.summary}}</div>
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
            <span>{{store.activeBook.counter.chapter}}章</span>
            <chevron-right-icon size="larger"/>
          </div>
        </template>
      </wx-card>
    </div>

    <book-not-found v-else/>

    <template #bar>
      <div
        class="book-detail-actions"
        v-if="store.activeBook !== null"
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
          @click="saveLocal"
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
        >
          <div>立即阅读</div>
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
