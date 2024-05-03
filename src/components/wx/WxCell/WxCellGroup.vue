<script setup lang="ts">
import WxBaseCard from "@/components/wx/WxBaseCard.vue";
import {provide} from "vue";
import {WxCellKey} from "@/components/wx/WxCell/wx-cell.ts";

const props = defineProps<{
  title?: string,
  bgColor?: string,
}>()

provide(WxCellKey, {
  groupTitle: props.title ?? '',
  groupBgColor: props.bgColor ?? 'white'
})
</script>

<template>
  <wx-base-card
    :style="{
      backgroundColor: props.bgColor ?? 'white',
      padding: 0,
    }"
  >
    <div
      v-if="props.title"
      class="wx-cell-group-title"
    >{{props.title}}</div>
    <slot name="default"/>
  </wx-base-card>
</template>

<style scoped lang="less">
.wx-cell-group-title {
  padding: 10px 0 0 10px;
  font-size: small;
  color: #aeafaf;
}
</style>
