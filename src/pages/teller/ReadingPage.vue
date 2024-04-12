<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import {useBookStore} from "@/store/teller/book.ts";

const store = useBookStore()
</script>

<template>
  <teller-sub-layout
    content-padding="0"
    :hide-at="['scroll', 'click']"
  >
    <div>
      <div>{{store.activeBook}}</div>
    </div>
  </teller-sub-layout>
</template>

<style scoped lang="less">
</style>
