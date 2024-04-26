<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import {useReading, useReadingSetting} from "@/store/teller/reading.ts";
import BookChapter from "@/pages/teller/components/BookChapter.vue";
import {
  BulletpointIcon,
  FocusIcon,
  SettingIcon,
  Code1Icon,
} from 'tdesign-icons-vue-next'
import {computed, ref} from "vue";
import ReadingSettings from "@/pages/teller/components/ReadingSettings.vue";
import {ColorHelper} from "@/utils/colors.ts";
import WxTabBar from "@/components/wx/WxTabBar/WxTabBar.vue";
import WxTabBarItem from "@/components/wx/WxTabBar/WxTabBarItem.vue";
import { useBattery, useNow } from '@vueuse/core'

const {
  book,
  chapterList,
  init,
} = useReading()

init()

const { theme } = useReadingSetting()

const {
  isSupported,
  level,
} = useBattery()

const now = useNow()
const fmtedNow = computed(() => {
  const date = now.value
  return `${date.getHours()}:${date.getMinutes()}`
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
      :style="{
        backgroundColor: theme.bg,
        color: infoBarFontColor,
      }"
    >
      <div>第一章 斗之气九段</div>
      <div class="device-info">
        <div
          v-show="isSupported"
        >{{level}}</div>
        <div
          style="margin-left: 5px;"
        >{{fmtedNow}}</div>
      </div>
    </div>

    <div
      v-if="book.uid !== 0"
      class="teller-reading-panel"
      :style="{ backgroundColor: theme.bg }"
      @scroll="handlePanelScroll"
      @click="handlePanelClick"
    >
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
        <div>
          <book-chapter
            v-for="chapter in chapterList"
            :key="chapter.key"
            :chapter="chapter"
          />
        </div>
      </div>
    </div>

    <div
      v-else
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

  .device-info {
    display: flex;
  }
}

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
