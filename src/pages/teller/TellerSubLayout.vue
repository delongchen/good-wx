<script setup lang="ts">
import { ChevronLeftIcon } from 'tdesign-icons-vue-next'
import {useRouter} from "vue-router";
import {ref} from "vue";

const props = defineProps<{
  hideBack?: boolean,
  title?: string,
  contentPadding?: string,
  clickToHideBar?: boolean
  clickToHideHeader?: boolean
}>()

const { back } = useRouter()

const showHeader = ref(true)
const showBar = ref(true)

const handleContentClick = () => {
  if (props.clickToHideHeader) {
    showHeader.value = !showHeader.value
  }
  if (props.clickToHideBar) {
    showBar.value = !showBar.value
  }
}
</script>

<template>
  <div class="teller-sub-layout">
    <div
      class="teller-sub-layout-header"
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
      @click="handleContentClick"
    >
      <slot name="default"/>
    </div>
    <div
      class="teller-sub-layout-bar"
      v-show="showBar"
    >
      <slot name="bar" />
    </div>
  </div>
</template>

<style scoped lang="less">
@top-space: 48px;
@bottom-space: 64px;

.teller-sub-layout-header {
  background-color: white;
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
  min-height: 100vh;
}

.teller-sub-layout-bar {
  background-color: white;
  height: @bottom-space;
  position: fixed;
  left: 0;
  right: 0;
  bottom: 0;
}
</style>
