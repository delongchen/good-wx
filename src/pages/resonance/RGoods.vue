<script setup lang="ts">
import RGoodsTable from "@/pages/resonance/components/RGoodsTable.vue";
import {infoVecRef} from "@/store/resonances";
import {computed} from "vue";

const goodsSet = computed(() => {
  return new Set(
    Array.from({
      length: infoVecRef.value.length
    }, (_, index) => index)
  )
})
</script>

<template>
  <r-goods-table :goods-set="goodsSet"/>
</template>

<style scoped lang="less">
</style>
