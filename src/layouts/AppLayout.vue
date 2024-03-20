<script setup lang="ts">
import AppHeader from "@/layouts/components/AppHeader.vue";
import AppFooter from "@/layouts/components/AppFooter.vue";
import {useRoute} from "vue-router";
import {foundTop} from "@/router";
import {computed} from "vue";

const topLevelStyle = computed<any>(
  () => foundTop(useRoute().fullPath)?.meta?.style ?? null
)
</script>

<template>
  <div class="app-container" :style="topLevelStyle">
    <app-header />
    <div class="app-main">
      <router-view/>
    </div>
    <app-footer/>
  </div>
</template>

<style scoped lang="less">
.app-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;

  .app-main {
    flex: 1;
  }
}
</style>
