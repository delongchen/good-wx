<script setup lang="ts">
import RGoodsTable from "@/pages/resonance/components/RGoodsTable.vue";
import {computed} from "vue";
import {setting} from "@/store/resonances/settings.ts";

const goodsSet = computed(() => new Set(setting.value.favoriteGoods))
</script>

<template>
  <r-goods-table :goods-set="goodsSet"/>
  <div
    v-if="goodsSet.size === 0"
    class="r-goods-no-content"
  >
    <div>
      <div>您尚未添加特别关注</div>
      <div>请在上方<span style="color: white;">设置</span>中添加</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.r-goods-no-content {
  color: #aeafaf;
  font-size: large;
  margin-top: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
