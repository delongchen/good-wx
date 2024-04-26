<script setup lang="ts">
import {TabBarProps, tabBarProvide} from "@/components/wx/WxTabBar/tab-bar.ts";
import {computed, Ref} from "vue";

const [ modelValue ] = defineModel<string | number>()
const props = defineProps<TabBarProps>()
const emit = defineEmits<{
  change: [value: string | number]
}>()
const name = 'wx-tab-bar'

const tabBarClasses = computed(() => [
  `${name}`,
  {
    [`${name}-fixed`]: props.fixed
  }
])

const onChange = (value: string | number) => {
  emit('change', value)
}

tabBarProvide(
  props,
  modelValue as Ref<string | number>,
  onChange
)
</script>

<template>
  <div :class="tabBarClasses">
    <slot name="default"/>
  </div>
</template>

<style scoped lang="less">
.wx-tab-bar {
  display: flex;
  position: relative;
  padding: 10px 48px 10px 48px;
  height: 100%;
  align-items: center;
  justify-content: space-between;
}
</style>
