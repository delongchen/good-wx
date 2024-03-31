<script setup lang="ts">
import {useLocale} from "@/locales/useLocale";
import {useRoute, useRouter} from "vue-router";
import { TellerSubRouter } from "@/router/modules/teller";
import {computed} from "vue";
import {
  BookIcon,
  AddressBookIcon,
  GridAddIcon,
  GridViewIcon,
  SerenityIcon,
  Excited1Icon,
  Code1Icon,
  CodeIcon,
} from 'tdesign-icons-vue-next'

const { getT } = useLocale()
const t = getT('pages.teller.components.tabBar')

const route = useRoute()
const router = useRouter()

const icons = [
  {
    select: AddressBookIcon,
    unselect: BookIcon,
  },
  {
    select: GridViewIcon,
    unselect: GridAddIcon,
  },
  {
    select: CodeIcon,
    unselect: Code1Icon,
  },
  {
    select: Excited1Icon,
    unselect: SerenityIcon
  },
]

interface LinkItem {
  path: string,
  text: string,
  index: number,
  selected: boolean
}

const tabList = computed(() => {
  const result: LinkItem[] = []

  for (const r of TellerSubRouter) {
    const text = <string>r?.meta?.text ?? ''
    result.push({
      path: r.path,
      text: text.startsWith('#') ? t(text.slice(1)) : text,
      index: r?.meta?.index ?? 0,
      selected: route.fullPath.startsWith(r.path)
    })
  }

  result.sort((a, b) => a.index - b.index)

  return result
})

const clickLink = (item: LinkItem) => {
  if (item.path !== route.fullPath) {
    router.replace({ path: item.path })
      .then(() => {
        scroll({
          left: 0,
          top: 0,
        })
      })
  }
}
</script>

<template>
  <div
    class="teller-tab-bar"
  >
    <div
      v-for="item in tabList"
      :key="item.index"
    >
      <div
        class="teller-tab-bar-item"
        @click="() => { clickLink(item) }"
        :style="{ color: item.selected ? '#48b883' : '#615d5d' }"
      >
        <div class="teller-tab-bar-item-icon">
          <component :is="item.selected ? icons[item.index].select : icons[item.index].unselect"/>
        </div>
        <div class="teller-tab-bar-item-text">{{item.text}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.teller-tab-bar {
  display: flex;
  position: fixed;
  width: 100%;
  left: 0;
  bottom: 0;
  background-color: white;
  justify-content: space-around;
  align-items: center;

  @media @max960 {
    height: 64px;
  }
}

.teller-tab-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.teller-tab-bar-item-icon {
  font-size: x-large;
}

.teller-tab-bar-item-text {
  font-size: x-small;
}
</style>
