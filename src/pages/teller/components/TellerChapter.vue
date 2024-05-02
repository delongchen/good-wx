<script setup lang="ts">
import {BookStatus, useChapter, useReadingSetting} from "@/store/teller/reading.ts";
import {computed, ref, watch} from "vue";
import {ElementPosition, useElementPosition} from "@/utils/el.ts";

const props = defineProps<{
  chapterKey: string
}>()

const emits = defineEmits<{
  positionChange: [
    key: string,
    value: ElementPosition,
    title: string,
  ]
}>()

const panelRef = ref<HTMLDivElement | null>(null)

const {
  chapter,
  status,
} = useChapter(() => props.chapterKey)

const { fontSize } = useReadingSetting()
const fontSizeStr = computed(() => {
  const size = fontSize.value

  return {
    title: `${size + 4}px`,
    p: `${size}px`,
    space: `${size * 2}px`,
  }
})

const { position } = useElementPosition(panelRef)

watch(() => position.value, (value) => {
  emits('positionChange', props.chapterKey, value, chapter.value.title)
})
</script>

<template>
  <div
    class="teller-chapter-panel"
    ref="panelRef"
  >
    <div
      v-if="status === BookStatus.Ready"
    >
      <div
        class="teller-chapter-title"
        :style="{
          fontSize: fontSizeStr.title,
          padding: `${fontSizeStr.title} 0 ${fontSizeStr.title} 0`
        }"
      >{{chapter.title}}</div>
      <div
        class="teller-chapter-text"
        :style="{ fontSize: fontSizeStr.p }"
      >
        <div
          v-for="(p, pIndex) in chapter.paragraphs"
          :key="pIndex"
          :style="{ marginBottom: fontSizeStr.title }"
        >
          <div
            v-for="(line, lineIndex) in p"
            :key="lineIndex"
          >
            <span :style="{ width: fontSizeStr.space, display: 'inline-block' }"></span>
            <span>{{line}}</span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.teller-chapter-panel {
  min-height: 105vh;
  padding: 24px;
}

.teller-chapter-title {
  font-weight: bold;

}
</style>
