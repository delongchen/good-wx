<script setup lang="ts">
import { infoVecRef } from "@/store/resonances";
import {computed, ref} from "vue";
import {presetSorts, NoSort} from "@/store/resonances/sort";
import {RGoodsInfo} from "@/store/resonances/type.ts";
import RGoodsCard from "@/pages/resonance/components/RGoodsCard.vue";

const props = defineProps<{
  goodsSet: Set<number>
}>()

const sortId = ref(0)

const goodsList = computed(() => {
  const sort = presetSorts[sortId.value] ?? NoSort
  const result: RGoodsInfo[] = []
  for (const index of props.goodsSet) {
    const goods = infoVecRef.value[index]
    if (goods !== undefined) {
      result.push(goods)
    }
  }
  return result.sort(sort.fn)
})
</script>

<template>
  <div>
    <r-goods-card
      v-for="(goods, key) in goodsList"
      :key="key"
      :info="goods"
      class="r-goods-card"
    />
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.r-goods-card {
  margin-top: @app-space;
}
</style>
