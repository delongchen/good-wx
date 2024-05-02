<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import {BookStatus, useBook, useReadingSetting} from "@/store/teller/reading.ts";
import {BulletpointIcon, Code1Icon, FocusIcon, SettingIcon,} from 'tdesign-icons-vue-next'
import {computed, ref} from "vue";
import ReadingSettings from "@/pages/teller/components/ReadingSettings.vue";
import {ColorHelper} from "@/utils/colors.ts";
import WxTabBar from "@/components/wx/WxTabBar/WxTabBar.vue";
import WxTabBarItem from "@/components/wx/WxTabBar/WxTabBarItem.vue";
import {useIntersectionObserver, useNow} from '@vueuse/core'
import WxBattery from "@/components/wx/WxBattery.vue";
import {useRoute} from "vue-router";
import TellerChapter from "@/pages/teller/components/TellerChapter.vue";

const route = useRoute()
const {
  book,
  status: bookStatus,
  record,
  chapterList,
  handleNextChapter,
  handleChapterPosition,
} = useBook(() => +(route.query?.uid ?? 0))

const { theme } = useReadingSetting()

const now = useNow()
const fmtedNow = computed(() => {
  const date = now.value
  const h = date.getHours()
  const m = date.getMinutes()
  return `${h < 10 ? '0' + h : h}:${m < 10 ? '0' + m : m}`
})

const borderColor = computed(() => {
  return ColorHelper
    .fromHex(theme.value.panel)
    .darker()
    .toHex()
})

const infoBarFontColor = computed(() => {
  return ColorHelper
    .basisBetween(theme.value.font, theme.value.bg)
    .toHex()
})

const curTabBarItem = ref('')
const showHeader = ref(true)
const showFooter = ref(true)

const hideTools = () => {
  curTabBarItem.value = ''
  showHeader.value = false
  showFooter.value = false
}

const showTools = () => {
  curTabBarItem.value = ''
  showHeader.value = true
  showFooter.value = true
}

const handlePanelScroll = () => {
  hideTools()
}

const handlePanelClick = () => {
  if (showFooter.value) {
    hideTools()
  } else {
    showTools()
  }
}

const handleTabBarChange = (activeValue: string | number) => {
  if (activeValue !== curTabBarItem.value) {
    curTabBarItem.value = activeValue as string
  } else {
    curTabBarItem.value = ''
  }
}

const tabBarItems = [
  {
    label: '目录',
    value: 'indexes',
    icon: BulletpointIcon,
  },
  {
    label: '进度',
    value: 'schedule',
    icon: FocusIcon,
  },
  {
    label: '设置',
    value: 'settings',
    icon: SettingIcon,
  },
  {
    label: '规则',
    value: 'rules',
    icon: Code1Icon,
  },
]

const nextChapterTriggerRef = ref<HTMLDivElement | null>(null)
const nextChapterTrigger = useIntersectionObserver(
  nextChapterTriggerRef,
  ([{ isIntersecting }]) => {
    if (isIntersecting) {
      handleNextChapter()
    }
  }
)
</script>

<template>
  <teller-sub-layout
    content-padding="0"
    :header-bar-color="theme.panel"
    :style="{ color: theme.font }"
    :show-header="showHeader"
    :show-footer="showFooter"
  >
    <div
      class="reading-info-bar"
      v-if="record.chapter !== -1"
      :style="{
        backgroundColor: theme.bg,
        color: infoBarFontColor,
      }"
    >
      <div class="chapter-info">{{record.title}}</div>
      <div class="device-info">
        <wx-battery :color="infoBarFontColor"/>
        <div
          style="margin-left: 5px;"
        >{{fmtedNow}}</div>
      </div>
    </div>

    <div
      v-if="bookStatus === BookStatus.Ready"
      class="teller-reading-panel"
      :style="{ backgroundColor: theme.bg }"
      @scroll="handlePanelScroll"
      @click="handlePanelClick"
    >
      <div
        class="reading-header"
        v-if="record.chapter === -1"
      >
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
          class="chapter-trigger"
          v-if="record.chapter > 0"
        ></div>

        <div>
          <teller-chapter
            v-for="chapterKey in chapterList"
            :key="chapterKey"
            @position-change="handleChapterPosition"
            :chapter-key="chapterKey"
          />
        </div>

        <div
          v-if="nextChapterTrigger.isSupported"
          class="chapter-trigger"
          ref="nextChapterTriggerRef"
        ></div>
      </div>
    </div>

    <div
      v-else-if="bookStatus === BookStatus.Loading"
    >loading</div>

    <div
      v-else-if="bookStatus === BookStatus.NotFound"
      :style="{ backgroundColor: theme.bg }"
      class="book-not-found"
    >
      <div>迷路惹</div>
    </div>

    <template #bar>
      <wx-tab-bar
        :style="{ backgroundColor: theme.panel }"
        v-model="curTabBarItem"
        :active-color="theme.highlight"
        @change="handleTabBarChange"
      >
        <wx-tab-bar-item
          v-for="item in tabBarItems"
          :key="item.value"
          :label="item.label"
          :value="item.value"
        >
          <template #icon>
            <component :is="item.icon"/>
          </template>
        </wx-tab-bar-item>
      </wx-tab-bar>
    </template>
  </teller-sub-layout>

  <div
    class="tab-bar-external-panel"
    v-show="curTabBarItem !== ''"
    :style="{
      backgroundColor: theme.panel,
      color: theme.font,
      borderTop: `1px solid ${borderColor}`,
      borderBottom: `1px solid ${borderColor}`,
    }"
  >
    <reading-settings v-if="curTabBarItem === 'settings'"/>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.teller-reading-panel {
  height: 100vh;
  overflow: scroll;
  scrollbar-width: none;
}

.reading-info-bar {
  position: fixed;
  z-index: 10;
  top: 0;
  left: 0;
  right: 0;
  padding: 10px;
  font-size: smaller;

  display: flex;
  align-items: center;
  justify-content: space-between;

  .chapter-info {
    width: 40vh;
    overflow: hidden;
  }

  .device-info {
    display: flex;
    align-items: center;
  }
}

.reading-header {
  min-height: 105vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding-top: 20vh;
}

.chapter-trigger {
  height: 10vh;
}

.book-header-text {
  margin-top: 24px;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.book-not-found {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: xxx-large;
}

.tab-bar-external-panel {
  position: fixed;
  left: 0;
  right: 0;
  bottom: 64px;
  padding: @app-space;
  max-height: 80vh;
  overflow: scroll;
  scrollbar-width: none;
  border-radius: @app-space @app-space 0 0;
}
</style>
