<script setup lang="ts">
import {RGoodsAsyncInfo, RGoodsInfo} from "@/store/resonances/type";
import WxCard from "@/components/wx/WxCard.vue";
import {computed, ref} from "vue";
import RGoodsStatistic from "@/pages/resonance/components/RGoodsStatistic.vue";
import { SwapRightIcon } from 'tdesign-icons-vue-next'
import {distanceOf, getCityName} from "@/store/resonances/static";

const props = defineProps<{
  info: RGoodsInfo
}>()

const saleInfo = computed(() => {
  const result: {
    distance: number,
    cityName: string,
    info: RGoodsAsyncInfo,
  }[] = []

  for (let i = 0; i < props.info.saleInfo.length; i++) {
    if (i !== props.info.baseInfo.cityId) {
      result.push({
        info: props.info.saleInfo[i],
        distance: distanceOf(props.info.baseInfo.cityId, i),
        cityName: getCityName(i),
      })
    }
  }

  return result
})

const showMore = ref(false)
</script>

<template>
  <wx-card
    :title="props.info.baseInfo.goodsName"
    title-size="x-large"
    :sub-title="props.info.baseInfo.cityName"
    header-margin="0"
  >
    <template #content>
      <div class="r-goods-card-content">
        <r-goods-statistic
          :distance="0"
          :info="props.info.buyInfo"
          city-name="原产地"
        />
        <div style="margin: 0 20px 0 20px;">
          <swap-right-icon size="xx-large"/>
        </div>
        <div class="r-goods-card-sale-info">
          <r-goods-statistic
            v-if="!showMore"
            :distance="saleInfo[0].distance"
            :city-name="saleInfo[0].cityName"
            :info="saleInfo[0].info"
          />
          <template v-else>
            <r-goods-statistic
              v-for="(item, key) in saleInfo"
              :key="key"
              :distance="item.distance"
              :city-name="item.cityName"
              :info="item.info"
              margin="0 20px 0 0"
            />
          </template>
        </div>
      </div>
    </template>

    <template #actions>
      <span @click="showMore = !showMore">more</span>
    </template>
  </wx-card>
</template>

<style scoped lang="less">
.r-goods-card-content {
  display: flex;
  align-items: center;
  justify-content: center;
}

.r-goods-card-sale-info {
  display: flex;
}
</style>
