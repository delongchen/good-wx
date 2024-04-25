<script setup lang="ts">
import {BookChapterInterface} from "@/types/teller/books";
import {computed, ref} from "vue";
import {useReadingSetting} from "@/store/teller/reading.ts";

const props = defineProps<{
  chapter: BookChapterInterface | null
}>()

const panelRef = ref<HTMLDivElement | null>(null)
const { fontSize } = useReadingSetting()

const computedFontSize = computed(() => {
  return {
    chapter: `${fontSize.value}px`,
    title: `${fontSize.value + 2}px`
  }
})
</script>

<template>
  <div
    class="book-chapter"
    ref="panelRef"
  >
    <div v-if="props.chapter !== null">
      <div
        class="chapter-title"
        :style="{ fontSize: computedFontSize.title }"
      >{{props.chapter.title}}</div>
      <div class="chapter-ps">
        <div
          class="chapter-p"
          v-for="(p, pIndex) in props.chapter.paragraphs"
          :key="pIndex"
        >
          <div
            class="chapter-line"
            v-for="(line, lineIndex) in p"
            :key="lineIndex"
          >
            <span
              :style="{
                fontSize: computedFontSize.chapter
              }"
            >{{line}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.book-chapter {
  padding: 10px;
  min-height: 110vh;
}

.chapter-title {
  font-weight: bold;
}

.chapter-p {
  margin-top: @app-space;
}

.chapter-line {
  margin-top: @app-space;
  line-height: 1.7;
  ::before {
    content: '';
    margin-right: 40px;
  }
}
</style>
