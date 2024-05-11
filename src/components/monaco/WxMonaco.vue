<script setup lang="ts">
import {nextTick, onBeforeUnmount, onMounted, ref, shallowRef, watch} from "vue";
import * as monaco from 'monaco-editor'
import {initMonaco} from "@/components/monaco/initMonaco.ts";

const props = withDefaults(
  defineProps<{
    value?: string,
    theme?: string,
    language?: string,
    readonly?: boolean,
  }>(),
  {
    value: '',
    theme: 'vs-dark'
  }
)

const emits = defineEmits<{
  change: [value: string]
}>()

const containerRef = ref(null)

const editor = shallowRef<monaco.editor.IStandaloneCodeEditor>()
const ready = ref(false)

onMounted(async () => {
  ready.value = true
  await nextTick()

  if (containerRef.value === null) {
    throw new Error('Cannot find editor container')
  }

  initMonaco(props.language)

  const editorInstance = monaco.editor.create(
    containerRef.value,
    {
      value: '',
      readOnly: props.readonly ?? false,
      fontSize: 13,
      tabSize: 2,
      theme: props.theme,
      language: props.language,
      automaticLayout: true,
      minimap: {
        enabled: false,
      },
      scrollBeyondLastLine: false,
    }
  )

  editor.value = editorInstance

  watch(
    () => props.value,
    value => {
      if (editorInstance.getValue() === value) return
      editorInstance.setValue(value ?? '')
    },
    {immediate: true}
  )

  editorInstance.onDidChangeModelContent(() => {
    emits('change', editorInstance.getValue())
  })
})

onBeforeUnmount(() => {
  editor.value?.dispose()
})
</script>

<template>
  <div
    ref="containerRef"
    class="wx-editor"
  />
</template>

<style scoped lang="less">
.wx-editor {
  height: 100%;
  width: 100%;
  overflow: hidden;
}
</style>
