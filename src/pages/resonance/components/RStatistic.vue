<script setup lang="ts">
import {TrendingUpIcon, TrendingDownIcon} from 'tdesign-icons-vue-next'
import {PriceTrend, RGoodsInfoType} from "@/store/resonance.ts";
import {computed} from "vue";
import {timeDistance} from "@/utils/time.ts";

const props = defineProps<{
  info: RGoodsInfoType
  city: string
}>()

const color = computed<string>(() => {
  const value = props.info.price
  if (value === 100) return 'gray'
  return value < 100 ? '#2ba471' : '#d54941'
})

const timeInfo = computed(() => {
  return timeDistance(props.info.time)
})
</script>

<template>
  <div class="r-statistic" :style="{color}">
    <div class="r-statistic-title">{{props.city}}</div>
    <div class="r-statistic-content">
      <span>{{props.info.price}}</span>
      <span style="font-size: small">%</span>
      <span>
        <trending-up-icon v-if="props.info.trend === PriceTrend.Up"/>
        <trending-down-icon v-else/>
      </span>
    </div>
    <div class="r-statistic-time">{{timeInfo}}</div>
  </div>
</template>

<style scoped lang="less">
.r-statistic-title {
  font-size: small;
  color: #aeafaf;
}

.r-statistic-content {
  span {
    font-size: xx-large;
  }
}

.r-statistic-time {
  font-size: small;
}
</style>
