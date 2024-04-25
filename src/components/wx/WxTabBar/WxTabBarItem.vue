<script setup lang="ts">
import {tabBarInject} from "@/components/wx/WxTabBar/tab-bar.ts";

defineOptions({
  name: 'wx-tab-bar-item',
})

const {
  parentProps,
} = tabBarInject()
</script>

<template>
  <div>
    <div><slot name="default"/></div>
    <div><slot name="content"/></div>
  </div>
</template>

<style scoped lang="less">

</style>
