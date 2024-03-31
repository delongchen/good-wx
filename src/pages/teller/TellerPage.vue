<script setup lang="ts">
import TellerTabBar from "@/pages/teller/components/TellerTabBar.vue";
</script>

<template>
  <div class="teller-main-layout">
    <div class="teller-page-content">
      <router-view/>
    </div>
    <teller-tab-bar/>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.teller-main-layout {
  color: #181818;
  min-height: 100vh;
  background-color: #e7e7e7;
}

.teller-page-content {
  @media @max960 {
    padding-bottom: 64px;
  }
}
</style>
