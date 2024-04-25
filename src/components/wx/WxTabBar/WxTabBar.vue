<script setup lang="ts">
import {TabBarProps, tabBarProvide} from "@/components/wx/WxTabBar/tab-bar.ts";
import {computed} from "vue";

//const model = defineModel()
const props = defineProps<TabBarProps>()
const name = 'wx-tab-bar'

const tabBarClasses = computed(() => [
  `${name}`,
  {
    [`${name}-fixed`]: props.fixed
  }
])

tabBarProvide(props)
</script>

<template>
  <div :class="tabBarClasses">
    <slot name="default"/>
  </div>
</template>

<style scoped lang="less">

</style>
