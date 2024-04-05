<script setup lang="ts">
import TellerTabBar from "@/pages/teller/components/TellerTabBar.vue";
import {useRoute} from "vue-router";
import {computed} from "vue";

const route = useRoute()
const showTabBar = computed(() => {
  return route?.meta?.hideTabBar !== true
})
</script>

<template>
  <div class="teller-main-layout">
    <div :class="{
      'teller-page-content': showTabBar
    }">
      <router-view/>
    </div>
    <teller-tab-bar v-if="showTabBar"/>
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
