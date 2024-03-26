<script setup lang="ts">
import { nameMapWithId } from '@/store/resonances/static'

const props = defineProps<{
  select: (id: number) => void
  hasSelected: (id: number) => boolean,
  cityNameStyle?: string,
  selectedStyle?: string,
  unselectedStyle?: string,
}>()
</script>

<template>
  <div class="r-goods-selector">
    <div
      v-for="(city, cityIndex) in nameMapWithId"
      :key="cityIndex"
    >
      <div :style="props.cityNameStyle">{{city[0]}}</div>
      <div class="r-goods-selector-goods-list">
        <div
          v-for="goods in city[1]"
          :key="goods.id"
          @click="() => { props.select(goods.id) }"
          :style="props.hasSelected(goods.id) ? props.selectedStyle : props.unselectedStyle"
          class="r-goods-selector-goods-item"
        >{{goods.name}}</div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.r-goods-selector {
  padding-left: @app-space;
  display: flex;
  flex-direction: column;

  .r-goods-selector-goods-list {
    display: flex;
    flex-wrap: wrap;
    justify-content: center;
  }

  .r-goods-selector-goods-item {
    padding: 4px;
    cursor: pointer;
  }
}
</style>
