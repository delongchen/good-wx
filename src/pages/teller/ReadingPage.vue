<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import {useReading} from "@/store/teller/reading.ts";
import BookChapter from "@/pages/teller/components/BookChapter.vue";
import {
  BulletpointIcon,
  FocusIcon,
  SettingIcon,
  Code1Icon,
} from 'tdesign-icons-vue-next'

const {
  book,
  chapterList,
  hasNext,
  hasPrev,
  init,
  nextChapter,
} = useReading()

init()

const addNextChapter = (ev: Event) => {
  ev.stopPropagation()
  nextChapter()
}
</script>

<template>
  <teller-sub-layout
    content-padding="0"
    :hide-at="['scroll', 'click']"
  >
    <div v-if="book !== null">
      <div class="reading-header">
        <div class="book-header-cover">
          <img :src="book.cover" :alt="book.name">
        </div>
        <div class="book-header-text">
          <div style="font-size: x-large; font-weight: bold;">{{book.name}}</div>
          <div>{{book.author}}</div>
        </div>
      </div>
      <div>
        <div
          v-if="hasPrev"
          class="chapter-trigger-panel"
        >
          <div class="trigger-area"></div>
          <div class="trigger-text">
            <div>上一章</div>
          </div>
        </div>
        <div>
          <book-chapter
            v-for="chapter in chapterList"
            :key="chapter.key"
            :chapter="chapter"
          />
        </div>
        <div
          v-if="hasNext"
          class="chapter-trigger-panel"
        >
          <div class="trigger-text">
            <div @click="addNextChapter">下一章</div>
          </div>
          <div class="trigger-area"></div>
        </div>
      </div>
    </div>

    <div v-else>

    </div>

    <template #bar>
      <div class="reading-tab-bar">
        <div class="reading-tab-bar-item">
          <div style="font-size: x-large;"><bulletpoint-icon/></div>
          <div style="font-size: small;">目录</div>
        </div>
        <div class="reading-tab-bar-item">
          <div style="font-size: x-large;"><focus-icon/></div>
          <div style="font-size: small;">进度</div>
        </div>
        <div class="reading-tab-bar-item">
          <div style="font-size: x-large;"><setting-icon/></div>
          <div style="font-size: small;">设置</div>
        </div>
        <div class="reading-tab-bar-item">
          <div style="font-size: x-large;"><code1-icon/></div>
          <div style="font-size: small;">规则</div>
        </div>
      </div>
    </template>
  </teller-sub-layout>
</template>

<style scoped lang="less">
.reading-header {
  min-height: 105vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20vh;
}

.book-header-text {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.chapter-trigger-panel {
  .trigger-text {
    height: 5vh;
    position: relative;
    div {
      padding: 10px;
      border: 1px solid black;
      position: absolute;
      left: 50%;
      top: 50%;
      transform: translate(-50%, -50%);
    }
  }
  .trigger-area {
    height: 5vh;
  }
}

.reading-tab-bar {
  display: flex;
  padding: 10px 36px 10px 36px;
  height: 100%;
  align-items: center;
  justify-content: space-between;

  .reading-tab-bar-item {
    display: flex;
    flex-direction: column;
    align-items: center;
  }
}
</style>
