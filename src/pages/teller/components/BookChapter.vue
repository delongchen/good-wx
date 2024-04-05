<script setup lang="ts">
import {BookChapterType} from "@/types/teller/books";

const props = defineProps<{
  chapter: BookChapterType
}>()
</script>

<template>
  <div>
    <div>{{props.chapter.title}}</div>
    <div>
      <div
        v-for="(p, pIndex) in props.chapter.paragraphs"
        :key="pIndex"
      >
        <div
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

</style>
