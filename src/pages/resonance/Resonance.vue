<script setup lang="ts">
import {useRoute, useRouter} from "vue-router";

const route = useRoute()
const router = useRouter()

const links = [
  {
    text: '交易总表',
    path: '/resonance/goods'
  },
  {
    text: '城市交易表',
    path: '/resonance/goods-city'
  }
]

const onSwitch = (path: string) => {
  if (path === route.path) return
  router.push({path})
}
</script>

<template>
  <div class="r-home-switch">
    <div
      v-for="(link, key) in links"
      :key="key"
      class="r-home-switch-item"
      :class="{
        'r-home-switch-selected': link.path === route.path
      }"
      @click="() => { onSwitch(link.path) }"
    >{{link.text}}</div>
  </div>
  <router-view/>
</template>

<style scoped lang="less">
@import "@/style/preset";

.r-home-switch {
  display: flex;
  justify-content: space-around;
  font-size: x-large;
  margin-top: @app-space;
}

.r-home-switch-item {
  border-bottom: 2px solid @app-black;
  cursor: pointer;
}

.r-home-switch-selected {
  border-bottom: 2px solid #48b883;
}
</style>
