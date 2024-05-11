<script setup lang="ts">
const props = defineProps<{
  height?: string
}>()
</script>

<template>
  <div
    class="double-line-layout"
    :style="{ height: props.height }"
  >
    <div class="double-line-aside"><slot name="aside"/></div>
    <div class="double-line-content"><slot name="default"/></div>
  </div>
</template>

<style scoped lang="less">
.double-line-layout {
  display: flex;
}

.double-line-content {
  flex: 1;
}
</style>
