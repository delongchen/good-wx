<script setup lang="ts">
import {RGoodsAsyncInfo} from "@/store/resonances/type";
import {computed} from "vue";
import {timeDistance} from "@/utils/time";
import {TrendingDownIcon, TrendingUpIcon} from "tdesign-icons-vue-next";

const props = defineProps<{
  info: RGoodsAsyncInfo,
  distance: number,
  cityName: string,
  margin?: string,
}>()

const time = computed(() => {
  const timestamp = props.info.time
  return timeDistance(timestamp)
})

const color = computed<string>(() => {
  const value = props.info.price
  if (value === 100) return 'gray'
  return value < 100 ? '#2ba471' : '#d54941'
})
</script>

<template>
  <div class="r-goods-statistic" :style="{ margin }">
    <div class="r-goods-statistic-city">{{props.cityName}}</div>
    <div class="r-goods-statistic-time">{{time}}</div>
    <div :style="{ color }" class="r-goods-statistic-price">
      <span>{{props.info.price}}</span>
      <span style="font-size: small">%</span>
      <span>
        <trending-up-icon v-if="props.info.trend === 0"/>
        <trending-down-icon v-else/>
      </span>
    </div>
    <div
      class="r-goods-statistic-desc"
      v-if="props.distance !== 0"
    >
      {{props.info.profit}}$ / {{distance}}
      <span style="color: #aeafaf">km</span>
    </div>
  </div>
</template>

<style scoped lang="less">
.r-goods-statistic {
  display: flex;
  flex-direction: column;
}

.r-goods-statistic-city {
  font-size: smaller;
  color: #aeafaf;
}

.r-goods-statistic-time {
  font-size: x-small;
}

.r-goods-statistic-price {
  font-size: xx-large;
}

.r-goods-statistic-desc {
  font-size: small;
}
</style>
