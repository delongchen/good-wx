<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import {BookChapterType} from "@/types/teller/books.ts";
import {computed, onMounted, ref} from "vue";
import BookChapter from "@/pages/teller/components/BookChapter.vue";

const testData = Array.from(
  {length: 100},
  (_, index) => {
    const result: BookChapterType = {
      title: `chapter${index}`,
      key: `0-${index}`,
      paragraphs: [
        Array.from({length: 50}, (_, line) => {
          return [{text: `line${line}`}]
        })
      ]
    }
    return result
  }
)

const chapterIndex = ref(0)

const hasPre = computed<boolean>(() => {
  return chapterIndex.value > 1
})

const hasNext = computed<boolean>(() => {
  return chapterIndex.value < testData.length - 1
})

const renderList = ref<BookChapterType[]>([])

const nextTrigger = ref(null)

const ob = new IntersectionObserver(entries => {
})

onMounted(() => {
  ob.observe(<any>nextTrigger.value)
})
</script>

<template>
  <teller-sub-layout
    content-padding="0"
    :hide-at="['scroll', 'click']"
  >
    <div>
      <div>
        <div v-if="hasPre"></div>
        <div v-else>
          <div style="height: 50vh;">
            start
          </div>
        </div>
      </div>
      <div>
        <book-chapter
          v-for="item in renderList"
          :key="item.key"
          :chapter="item"
        />
      </div>
      <div>
        <div
          v-if="hasNext"
          style="height: 20vh; background-color: #48b883;"
          ref="nextTrigger"
          id="teller-next-trigger"
        ></div>
        <div v-else>
          <div style="height: 50vh;">
            end
          </div>
        </div>
      </div>
    </div>
  </teller-sub-layout>
</template>

<style scoped lang="less">
</style>
