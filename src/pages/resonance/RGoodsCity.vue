<script setup lang="ts">
import RGoodsTable from "@/pages/resonance/components/RGoodsTable.vue";
import {computed} from "vue";
import {infoVecRef} from "@/store/resonances";

const xgl = computed(() => {
  const result = new Set<number>()
  for (const goods of infoVecRef.value) {
    if (goods.baseInfo.cityId === 0) {
      result.add(goods.baseInfo.goodsId)
    }
  }
  return result
})
</script>

<template>
  <div class="r-goods-city">
    <r-goods-table :goods-set="xgl"/>
  </div>
</template>

<style scoped lang="less">

</style>
