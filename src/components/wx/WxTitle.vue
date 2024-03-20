<script setup lang="ts">
const props = defineProps<{
  text: string,
  lowerSize?: string,
  upperSize?: string,
  endWith?: string,
  static?: boolean
}>()
</script>

<template>
  <div
    class="wx-title"
    :class="{
      'wx-title-async': props.static !== true // when only props.static eq to 'true'
    }"
  >
    <div
      v-for="(s, key) in props.text.split('#')"
      :key="key"
    >
      <span
        class="wx-title-upper"
        :style="{
          fontSize: props.upperSize
        }"
      >{{ s[0].toUpperCase() }}</span>
      <span
        class="wx-title-lower"
        :style="{fontSize: props.lowerSize}"
      >{{ s.slice(1).toLowerCase() }}</span>
    </div>
    <div>
      <span
        class="wx-title-upper"
        :style="{
          color: '#48b883',
          fontSize: props.upperSize,
        }"
      >{{ props.endWith }}</span>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.wx-title-async {
  cursor: pointer;
  &:hover {
    .wx-title-upper {
      animation-name: wx-gradient;
      animation-duration: 150ms;
      animation-fill-mode: forwards;
      animation-timing-function: linear;
    }
  }

  .wx-title-upper {
    color: white;
  }

  .wx-title-lower {
    @media @max960 {
      display: none;
    }
  }
}

.wx-title {
  display: flex;
}

.wx-title-upper {
  color: #48b883;
}

</style>
