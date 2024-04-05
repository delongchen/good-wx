<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import {useBookDetail} from "@/store/teller/books";
import {useRoute} from "vue-router";
import BookNotFound from "@/pages/teller/components/BookNotFound.vue";

const {
  book,
  setUid
} = useBookDetail()

const route = useRoute()
setUid(+route.query.uid!)
</script>

<template>
  <teller-sub-layout
    title="目录"
  >
    <div
      v-if="book !== null"
    >
      <div
        v-for="(chapter, index) in book.chapters"
        :key="index"
      >{{chapter}}</div>
    </div>

    <book-not-found v-else/>

    <template #bar>

    </template>
  </teller-sub-layout>
</template>

<style scoped lang="less">

</style>
