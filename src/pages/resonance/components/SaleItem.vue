<script setup lang="ts">
import WxCard from "@/components/wx/WxCard.vue";
import RStatistic from "@/pages/resonance/components/RStatistic.vue";
import {goodsNameMap, cityNameMap, MostValueInfo, distanceMap} from "@/store/resonance.ts";
import {computed} from "vue";

const props = defineProps<{
  info: MostValueInfo
}>()

const fromGoods = computed(() => {
  return goodsNameMap.value.get(props.info.from.id)!
})

const cityName = computed<string[]>(() => {
  return [
    cityNameMap.value.get(fromGoods.value.city) ?? '',
    cityNameMap.value.get(props.info.to.id) ?? ''
  ]
})

const cityDistance = computed<number>(() => {
  return distanceMap.value[fromGoods.value.city][props.info.to.id]!
})
</script>

<template>
  <wx-card>
    <template #content>
      <div class="goods-card">
        <div class="goods-card-title">{{fromGoods.name}}</div>
        <div class="goods-content">
          <r-statistic :info="props.info.from.info" :city="cityName[0]"/>
          <div class="goods-distance">
            <div>{{props.info.profit}}$</div>
            <div style="border-bottom: white 2px solid"></div>
            <div style="color: #aeafaf">{{cityDistance}}KM</div>
          </div>
          <r-statistic :info="props.info.to.info" :city="cityName[1]"/>
        </div>
      </div>
    </template>
  </wx-card>
</template>

<style scoped lang="less">
.goods-card {
  display: flex;
  align-items: center;
}

.goods-card-title {
  font-size: x-large;
  flex: 0 0 30%;
}

.goods-content {
  flex: 1;
  display: flex;
  align-items: center;
}

.goods-distance {
  display: flex;
  flex-direction: column;
  padding: 0 24px 0 24px;
}
</style>
