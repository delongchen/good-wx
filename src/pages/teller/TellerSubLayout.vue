<script setup lang="ts">
import { ChevronLeftIcon } from 'tdesign-icons-vue-next'
import {useRouter} from "vue-router";
import {computed, ref} from "vue";

const props = defineProps<{
  hideBack?: boolean,
  headerBarColor?: string,
  title?: string,
  contentPadding?: string,
  hideAt?: ('click' | 'scroll')[],
}>()

const { back } = useRouter()

const showHeader = ref(true)
const showBar = ref(true)

const hideAtSet = computed<Set<string>>(() => {
  return new Set(props.hideAt ?? [])
})

const handleHide = (ev: Event) => {
  if (hideAtSet.value.size === 0) return

  const evType = ev.type
  if (evType === 'click' && hideAtSet.value.has('click')) {
    showBar.value = !showBar.value
    showHeader.value = !showHeader.value
    return
  }

  if (hideAtSet.value.has(evType)) {
    showBar.value = false
    showHeader.value = false
  }
}
</script>

<template>
  <div class="teller-sub-layout">
    <div
      class="teller-sub-layout-header"
      :style="{ backgroundColor: props.headerBarColor ?? 'white' }"
      v-show="showHeader"
    >
      <div class="header-back" @click="back">
        <chevron-left-icon
          size="x-large"
          v-show="!props.hideBack"
        />
      </div>
      <div class="header-title">{{title}}</div>
      <div class="header-actions"><slot name="actions"/></div>
    </div>
    <div
      class="teller-sub-layout-content"
      :style="props.contentPadding ? `padding: ${props.contentPadding};` : null"
      @click="handleHide"
      @scroll="handleHide"
    >
      <slot name="default"/>
    </div>
    <transition name="bar">
      <div
        class="teller-sub-layout-bar"
        v-show="showBar"
      >
        <slot name="bar" />
      </div>
    </transition>
  </div>
</template>

<style scoped lang="less">
@top-space: 48px;
@bottom-space: 64px;

.teller-sub-layout-header {
  height: @top-space;
  position: fixed;
  padding: 0 10px 0 10px;
  top: 0;
  left: 0;
  right: 0;
  display: flex;
  justify-content: space-between;
  align-items: center;

  .header-title {
    font-size: x-large;
  }
}

.teller-sub-layout-content {
  padding: @top-space 0 @bottom-space 0;
  height: 100vh;
  overflow: scroll;
}

.teller-sub-layout-bar {
  height: @bottom-space;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
