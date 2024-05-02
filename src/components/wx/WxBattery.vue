<script setup lang="ts">
import {useBattery} from "@vueuse/core";
import {computed} from "vue";

const props = defineProps<{
  color: string
}>()

const battery = useBattery()

const charged = computed(() => {
  return `${(battery.level.value * 100) >> 0}%`
})
</script>

<template>
  <div
    class="wx-battery"
    v-if="battery.isSupported"
  >
    <div class="wx-battery-body">
      <div
        class="wx-battery-charged"
        :style="{
          width: charged,
          backgroundColor: props.color,
        }"
      />
    </div>
    <div
      class="wx-battery-point"
      :style="{ backgroundColor: props.color }"
    />
  </div>
</template>

<style scoped lang="less">
.wx-battery {
  display: flex;
  align-items: center;
}

.wx-battery-body {
  width: 22px;
  height: 12px;
  padding: 1px;
  border: 1px solid;

  .wx-battery-charged {
    height: 100%;
  }
}

.wx-battery-point {
  width: 2px;
  height: 4px;
}
</style>
