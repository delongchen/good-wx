<script setup lang="ts">
import {computed, inject} from "vue";
import {WxCellKey} from "@/components/wx/WxCell/wx-cell.ts";
import {ChevronRightIcon} from 'tdesign-icons-vue-next'

const name = 'wx-cell'

defineOptions({
  name,
})

const props = defineProps<{
  title?: string,
  leftIcon?: any,
  arrow?: boolean,
  note?: string,
}>()

const injection = inject<{
  groupTitle: string,
  groupBgColor: string,
}>(WxCellKey)

const isOutOfGroup = injection === undefined

const wxCellClasses = computed(() => {
  return [
    name,
    {
      [`${name}-out-of-group`]: isOutOfGroup
    }
  ]
})
</script>

<template>
  <div :class="wxCellClasses">
    <div class="wx-cell-left">
      <div v-if="props.leftIcon">
        <component :is="props.leftIcon"/>
      </div>
      <div>{{ props.title }}</div>
    </div>

    <div class="wx-cell-right">
      <div style="color: #aeafaf">{{ props.note }}</div>
      <div v-if="props.arrow">
        <chevron-right-icon/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.wx-cell {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px;

  .wx-cell-right {
    display: flex;
    align-items: center;
  }
}

.wx-cell-out-of-group {
  border-radius: 4px;
  background-color: white;
}
</style>
