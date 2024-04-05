<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import {useRoute} from "vue-router";
import {useReading} from "@/store/teller/reading";
import BookChapter from "@/pages/teller/components/BookChapter.vue";
import {BookChapterType} from "@/types/teller/books.ts";
import {ref, watchEffect} from "vue";

const route = useRoute()
const {
  state,
  curText
} = useReading()

state.uid = +route.query.uid!

const chapterList = ref<BookChapterType[]>([])

watchEffect(() => {
  const cur = curText.value
  if (cur !== null) {
    chapterList.value.push(cur)
  }
})
</script>

<template>
  <teller-sub-layout
    content-padding="0"
    click-to-hide-bar
    click-to-hide-header
  >
    <div style="height: 30vh;"/>
    <div>
      <book-chapter
        v-for="(chapter, index) in chapterList"
        :key="index"
        :chapter="chapter"
      />
    </div>
  </teller-sub-layout>
</template>

<style scoped lang="less">

</style>
