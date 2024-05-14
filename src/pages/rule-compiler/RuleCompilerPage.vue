<script setup lang="ts">
import WxMonaco from "@/components/monaco/WxMonaco.vue";
import {computed, ref} from "vue";
import {debounce} from "@/utils/fn.ts";
import * as TellerRuleLang from '@/core/monaco/lang/teller-rule'
import {compile} from "@/core/rule-compiler/compiler.ts";
import { ArrowLeftIcon, EditIcon } from 'tdesign-icons-vue-next'
import {useRouter} from "vue-router";
import {useEditing} from "@/store/rule-compiler/editor.ts";
import AsideBar from './aside-bar/index.vue'

const router = useRouter()
const {
  file,
  setFileContent,
  updateFileLatest,
  setFileName,
  saveToDb,
  saveAs,
  editorReadonly,
} = useEditing()

const compileErrors = ref<{line: number, message: string}[]>([])
const compileResult = ref<Map<string, string | null>>(new Map)

const compileSource = () => {
  const result = compile(file.value.content)
  if (Array.isArray(result)) {
    compileErrors.value = result
    compileResult.value.clear()
  } else {
    compileErrors.value = []
    compileResult.value = result
  }
}

const fileName = computed({
  get() {
    return file.value.name
  },
  set(value: string) {
    setFileName(value)
  }
})
const fileNameEditable = ref(false)

const handleSourceChange = debounce((value: string) => {
  setFileContent(value)
  updateFileLatest()
}, 250)

const backHome = () => {
  router.replace({ path: '/' })
}

const asideValue = ref('')
</script>

<template>
  <div class="rule-compiler-container">
    <header>
      <div style="color: #48b883; cursor: pointer;" @click="backHome">
        <arrow-left-icon/>
        <span>wxsb</span>
      </div>
      <div>
        <edit-icon
          style="cursor: pointer;"
          :style="{ color: fileNameEditable ? '#48b883': '' }"
          @click="fileNameEditable = !fileNameEditable"
        />
        <input
          v-model="fileName"
          :disabled="!fileNameEditable"
          class="source-file-name-input"
        >
      </div>
      <div class="editor-tool-bar">
        <div class="editor-tool-bar-item" @click="saveToDb">
          保存
        </div>
        <div class="editor-tool-bar-item" @click="saveAs">
          另存为
        </div>
        <div class="editor-tool-bar-item" @click="compileSource">
          编译
        </div>
      </div>
    </header>
    <div class="rule-compiler-content">
      <aside>
        <aside-bar v-model="asideValue"/>
      </aside>
      <main>
        <wx-monaco
          style="flex: 2; height: calc(100vh - 64px)"
          :theme="TellerRuleLang.themeName"
          :readonly="editorReadonly"
          :language="TellerRuleLang.id"
          :value="file.content"
          @change="handleSourceChange"
        />
        <div style="flex: 1; height: calc(100vh - 64px); overflow: scroll; scrollbar-width: none;">
          <div>
            <div>{{compileErrors}}</div>
            <div>{{compileResult}}</div>
          </div>
        </div>
      </main>
      <aside></aside>
    </div>
    <footer></footer>
  </div>
</template>

<style scoped lang="less">
@panel-border: 1px solid #444444;

.rule-compiler-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  background: #181818;
}

header, footer {
  height: 32px;
}

header {
  border-bottom: @panel-border;
  padding: 0 32px 0 32px;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.editor-tool-bar {
  display: flex;

  .editor-tool-bar-item {
    margin-left: 10px;
    cursor: pointer;
    &:hover {
      color: #48b883;
    }
  }
}

.source-file-name-input {
  outline-style: none;
  color: white;
  background: #181818;
  border: none;
  font-size: large;
}

footer {
  border-top: @panel-border;
}

.rule-compiler-content {
  height: calc(100vh - 64px);
  flex: 1;
  display: flex;
}

main {
  display: flex;
  flex: 1;
}

.rule-compiler-monaco {
  flex: 1;
}
</style>
