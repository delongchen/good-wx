<script setup lang="ts">
</script>

<template>
  <div class="wx-base-card">
    <slot/>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.wx-base-card {
  padding: @card-space;
  border-radius: 10px;
  background-color: @app-black-lighter;

  @media @max960 {
    padding: 10px;
  }
}
</style>
