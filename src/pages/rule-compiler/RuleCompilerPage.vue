<script setup lang="ts">
import WxMonaco from "@/components/monaco/WxMonaco.vue";
import {ref} from "vue";
import {debounce} from "@/utils/fn.ts";
import * as TellerRuleLang from '@/core/monaco/lang/teller-rule'
import {compile} from "@/core/rule-compiler/compiler.ts";
import testRuleTxt from '@/assets/rule.out.txt?raw'

const source = ref('')
const output = ref<[string, string][]>([])

const handleSourceChange = debounce((value: string) => {
  source.value = value
}, 250)

const compileSource = () => {
  const result = compile(source.value)
  if (!Array.isArray(result)) {
    output.value = [...result.entries()]
  }
}

const loadCode = () => {
  source.value = testRuleTxt
}
</script>

<template>
  <div class="rule-compiler-page">
    <div class="rule-editor-panel">
      <wx-monaco
        style="flex: 1;"
        :value="source"
        :language="TellerRuleLang.id"
        :theme="TellerRuleLang.themeName"
        @change="handleSourceChange"
      />
      <div
        class="rule-result"
        style="flex: 1;"
      >
        <div v-if="output.length !== 0">
          <div
            v-for="entry in output"
            :key="entry[0]"
          >{{entry[0]}} -> {{entry[1]}}</div>
        </div>
      </div>
    </div>

    <div
      class="editor-tool-bar"
    >
      <div
        @click="loadCode"
        class="editor-tool-item"
      >load</div>
      <div
        @click="compileSource"
        class="editor-tool-item"
      >compile</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.rule-editor-panel {
  height: 90vh;
  background-color: black;
  display: flex;
}

.rule-editor-container {
  flex: 1;
}

.rule-result {
  padding: 10px;
  overflow: scroll;
  scrollbar-width: none;
}

.editor-tool-bar {
  height: 10vh;
  background-color: #6d6e6f;
  display: flex;
  padding: 10px;
}

.editor-tool-item {
  cursor: pointer;
  padding: 10px;
  margin: 10px;
  background-color: #48b883;
  border-radius: 4px;
}
</style>
