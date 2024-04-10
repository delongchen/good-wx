<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import {useRoute, useRouter} from "vue-router";
import { DownloadIcon, TaskAddIcon, ChevronRightIcon } from 'tdesign-icons-vue-next'
import {computed} from "vue";
import {getCoverUrl} from "@/api/teller";
import {fmtCharNum} from "./utils";
import WxCard from "@/components/wx/WxCard.vue";
import {useBookDetail} from "@/store/teller/books";
import BookNotFound from "@/pages/teller/components/BookNotFound.vue";

const router = useRouter()
const route = useRoute()

const {
  isInLib,
  addToLib,
  book,
  uid,
  setUid,
} = useBookDetail()

setUid(+route.query.uid!)

const coverURL = computed<string>(() => getCoverUrl(book.value?.index))

const summary = computed(() => {
  if (book.value === null) return '加载中'

  const sum = book.value.index.info.sum
  if (sum === '') return '暂无'

  return sum
})

const goBookIndex = () => {
  router.push({ name: 'book-index', query: { uid: uid.value } })
    .then(() => {
      scroll({
        left: 0,
        top: 0,
      })
    })
}

const download = () => {
}

const readNow = () => {
  if (uid.value !== 0) {
    addToLib()
    router.push({
      name: 'reading',
      query: { uid: uid.value }
    })
  }
}
</script>

<template>
  <teller-sub-layout>
    <div
      v-if="book !== null"
      style="padding: 10px;"
    >
      <div class="book-detail-header">
        <div class="header-cover">
          <img :src="coverURL" alt="cover">
        </div>
        <div class="header-text">
          <div class="header-text-title">{{book.index.name}}</div>
          <div class="header-text-author">{{book.index.author}}</div>
          <div class="header-text-char">{{fmtCharNum(book.index.info.counter.char)}}字</div>
        </div>
      </div>

      <wx-card
        title="简介: "
        title-size="larger"
        class="book-detail-card"
      >
        <template #content>
          <div>{{summary}}</div>
        </template>
      </wx-card>

      <wx-card
        @click="goBookIndex"
        v-if="book !== null"
        title="目录"
        title-size="larger"
        header-margin="0"
        class="book-detail-card"
      >
        <template #actions>
          <div style="display: flex; align-items: center; color: #6d6e6f">
            <span>{{book.chapters.length}}章</span>
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
        <div class="book-detail-action" @click="download">
          <div class="action-icon">
            <download-icon/>
          </div>
          <div class="action-text">下载</div>
        </div>
        <div
          class="book-detail-action"
          @click="addToLib"
          :style="{
            color: isInLib ? '#aeafaf' : ''
          }"
        >
          <div class="action-icon">
            <task-add-icon/>
          </div>
          <div class="action-text">
            {{isInLib ? '已添加': '加书架'}}
          </div>
        </div>
        <div
          class="book-detail-actions"
          @click="readNow"
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
