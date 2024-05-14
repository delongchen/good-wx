<script setup lang="ts">
import { icons, routesMap } from "./router";
import {computed} from "vue";

const name = 'teller-rule-editor-left-side'
defineOptions({ name })

const model = defineModel<string>()

const handleIconClick = (name: string) => {
  if (name !== model.value) {
    model.value = name
  } else {
    model.value = ''
  }
}

const content = computed(() => {
  const name = model.value
  return routesMap.get(name ?? '')?.content ?? null
})
</script>

<template>
  <div
    class="editor-side-panel"
  >
    <div class="editor-tab-bar">
      <div
        class="editor-tab-bar-item"
        :class="{
          'editor-tab-bar-item-selected': model === icon.name
        }"
        v-for="icon in icons"
        :key="icon.name"
        @click="handleIconClick(icon.name)"
      >
        <component :is="icon.component"/>
      </div>
    </div>
    <div>
      <div
        v-if="content !== null"
        class="editor-tab-bar-content"
      >
        <component :is="content"/>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@panel-border: 1px solid #444444;

.editor-side-panel {
  display: flex;
  height: 100%;
}

.editor-tab-bar {
  display: flex;
  flex-direction: column;
  border-right: @panel-border;
  height: 100%;
}

.editor-tab-bar-content {
  border-right: @panel-border;
  background: #333333;
  height: 100%;
}

.editor-tab-bar-item {
  padding: 10px;
  font-size: x-large;
  cursor: pointer;
}

.editor-tab-bar-item-selected {
  background: #333333;
}
</style>
