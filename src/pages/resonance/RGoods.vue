<script setup lang="ts">
import {mostValueGoods} from "@/store/resonance.ts";
import SaleItem from "@/pages/resonance/components/SaleItem.vue";
</script>

<template>
  <div class="r-goods">
    <div>
      <h2>交易行情</h2>
    </div>
    <div
      v-if="mostValueGoods.length === 0"
      class="r-goods-loading"
    >
      加载中...
    </div>
    <div class="r-goods-list">
      <sale-item
        v-for="(item, key) in mostValueGoods"
        class="r-goods-list-item"
        :key="key"
        :info="item"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.r-goods-loading {
  font-size: xx-large;
  text-align: center;
}

.r-goods-list {
  display: flex;
  flex-direction: column;
}

.r-goods-list-item {
  margin-top: @app-space;
}
</style>
