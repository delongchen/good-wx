<script setup lang="ts">
import {tabBarInject} from "@/components/wx/WxTabBar/tab-bar.ts";
import {computed} from "vue";

const name = 'wx-tab-bar-item'

defineOptions({ name })

const props = defineProps<{
  label: string
  value: string
}>()

const {
  parentProps,
  activeValue,
  updateChild
} = tabBarInject()

const activeColor = computed(() => {
  return parentProps.activeColor ?? '#07a0ff'
})

const handleClick = () => {
  updateChild(props.value)
}
</script>

<template>
  <div
    :class="[`${name}`]"
    @click="handleClick"
    :style="{
      color: activeValue === props.value ? activeColor : ''
    }"
  >
    <div style="font-size: x-large;"><slot name="icon"/></div>
    <div style="font-size: small;">{{props.label}}</div>
  </div>
</template>

<style scoped lang="less">
.wx-tab-bar-item {
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
