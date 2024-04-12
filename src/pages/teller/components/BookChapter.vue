<script setup lang="ts">
import {BookChapterInterface} from "@/types/teller/books";
import {ref} from "vue";

const props = defineProps<{
  chapter: BookChapterInterface
}>()

const panelRef = ref<HTMLDivElement | null>(null)
</script>

<template>
  <div
    class="book-chapter"
    ref="panelRef"
  >
    <div
      class="chapter-title"
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
            v-for="(chunk, chunkIndex) in line"
            :key="chunkIndex"
          >{{chunk.text}}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.book-chapter {
  padding: 10px;
}

.chapter-title {
  font-size: x-large;
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

  span {
    font-size: larger;
  }
}
</style>
