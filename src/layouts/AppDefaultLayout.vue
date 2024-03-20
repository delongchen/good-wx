<script setup lang="ts">
import AppHeader from "@/layouts/AppHeader.vue";
import AppFooter from "@/layouts/AppFooter.vue";
</script>

<template>
  <div class="app-default-layout">
    <header>
      <app-header/>
    </header>
    <div class="app-default-layout-content">
      <aside/>
      <main><router-view/></main>
      <aside/>
    </div>
    <footer>
      <app-footer/>
    </footer>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.app-default-layout {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  background-color: @app-black;

  header, footer {
    flex: 0;
  }
}

.app-default-layout-content {
  flex: 1;
  display: flex;

  aside {
    width: 10%;
    max-width: 300px;
    @media @max960 {
      display: none;
    }
  }

  main {
    flex: 1;
    @media @max960 {
      padding: @app-space;
    }
  }
}
</style>
