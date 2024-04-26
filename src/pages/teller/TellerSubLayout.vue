<script setup lang="ts">
import { ChevronLeftIcon } from 'tdesign-icons-vue-next'
import {useRouter} from "vue-router";

const props = defineProps<{
  hideBack?: boolean,
  headerBarColor?: string,
  title?: string,
  contentPadding?: string,
  showHeader?: boolean,
  showFooter?: boolean,
}>()

const { back } = useRouter()
</script>

<template>
  <div class="teller-sub-layout">
    <div
      class="teller-sub-layout-header"
      :style="{ backgroundColor: props.headerBarColor ?? 'white' }"
      v-show="props.showHeader"
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
    >
      <slot name="default"/>
    </div>
    <transition name="bar">
      <div
        class="teller-sub-layout-bar"
        v-show="props.showFooter"
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
  z-index: 1000;
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
}

.teller-sub-layout-bar {
  height: @bottom-space;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
