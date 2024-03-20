<script setup lang="ts">
const goMIT = () => {
  const url = 'https://opensource.org/license/MIT'
  window.open(url, '_blank')
}
</script>

<template>
  <div class="app-footer">
    <div>Released under the <span @click="goMIT">MIT License</span>.</div>
    <div>Copyright © 2024 delong</div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.app-footer {
  border-top: 1px solid @app-black-lighter;
  margin-top: 200px;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: @app-space;

  div {
    font-size: small;
    color: #aeafaf;

    span {
      color: white;
      cursor: pointer;
    }
  }
}
</style>
