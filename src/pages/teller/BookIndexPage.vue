<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import BookNotFound from "@/pages/teller/components/BookNotFound.vue";
import {useBookStore} from "@/store/teller/shop.ts";

const store = useBookStore()

</script>

<template>
  <teller-sub-layout
    title="目录"
  >
    <div
      v-if="store.activeBook !== null"
    >
    </div>

    <book-not-found v-else/>

    <template #bar>

    </template>
  </teller-sub-layout>
</template>

<style scoped lang="less">

</style>
