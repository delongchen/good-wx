<script setup lang="ts">
import {ref} from "vue";
import WxCard from "@/components/wx/WxCard.vue";

const data = ref([])

fetch('http://localhost:11451/teller/index-list')
  .then(res => res.json())
  .then(res => {
    data.value = res
  })
</script>

<template>
  <div>{{data}}</div>
  <div
    class="teller-shop-content"
  >
    <wx-card
      title="今日必读"
      title-size="large"
      header-margin="0 0 10px 0"
      :style="{
      backgroundColor: 'white'
    }"
    ></wx-card>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.teller-shop-content {
  padding: @app-space;

  @media @max960 {
    padding: 10px;
  }
}
</style>
