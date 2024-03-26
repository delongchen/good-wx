<script setup lang="ts">
import RGoodsTable from "@/pages/resonance/components/RGoodsTable.vue";
import {computed, ref} from "vue";
import {StaticData, getCityName} from "@/store/resonances/static";
import WxButton from "@/components/wx/WxButton.vue";

const gen = () => {
  const result: {cityName: string, cityID: number, goodsSet: Set<number>}[] = []

  let start = 0
  for (let i = 0; i < StaticData.nameMap.length; i++) {
    result.push({
      cityName: getCityName(i),
      cityID: i,
      goodsSet: new Set<number>(
        Array.from({
          length: StaticData.nameMap[i][1].length
        }, (_, index) => index + start)
      )
    })
    start += StaticData.nameMap[i][1].length
  }

  return result
}

const cityList = gen()

const selectedCity = ref(0)

const goodsSet = computed(() => {
  const id = selectedCity.value
  return cityList[id].goodsSet
})
</script>

<template>
  <div class="r-goods-city">
    <div class="r-goods-city-selector">
      <wx-button
        v-for="(item, key) in cityList"
        :key="key"
        @click="selectedCity = item.cityID"
      >{{item.cityName}}</wx-button>
    </div>
    <h2 style="text-align: center">{{cityList[selectedCity].cityName}}</h2>
    <r-goods-table :goods-set="goodsSet"/>
  </div>
</template>

<style scoped lang="less">
.r-goods-city-selector {
  margin-top: 20px;
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
}
</style>
