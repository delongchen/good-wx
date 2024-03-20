<script setup lang="ts">
</script>

<template>
  <div class="wx-button">
    <slot/>
  </div>
</template>

<style scoped lang="less">
.wx-button {
  padding: 8px 18px 8px 18px;
  cursor: pointer;
  color: white;

  &:hover {
    animation-name: wx-gradient;
    animation-duration: 150ms;
    animation-fill-mode: forwards;
    animation-timing-function: linear;
  }
}
</style>
