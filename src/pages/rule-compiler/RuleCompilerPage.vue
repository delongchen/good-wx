<script setup lang="ts">
import WxMonaco from "@/components/monaco/WxMonaco.vue";
import {computed, ref, watch} from "vue";
import {debounce} from "@/utils/fn.ts";
import * as TellerRuleLang from '@/core/monaco/lang/teller-rule'
import {compile} from "@/core/rule-compiler/compiler.ts";
import { FileIcon, ArrowLeftIcon, SaveIcon, EditIcon } from 'tdesign-icons-vue-next'
import {useRouter} from "vue-router";
import {useEditing} from "@/store/rule-compiler/editor.ts";

const router = useRouter()
const {
  file,
  setFileContent,
  updateFileLatest,
  setFileName,
  changed,
  saveToDb,
  saveAs,
  localFiles,
  refreshLocalFiles,
  editFrom,
} = useEditing()

const output = ref<any>(null)

const fileName = computed({
  get() {
    return file.value.name
  },
  set(value: string) {
    changed.value = true
    setFileName(value)
  }
})
const fileNameEditable = ref(false)

const handleSourceChange = debounce((value: string) => {
  changed.value = true
  setFileContent(value)
  updateFileLatest()
}, 250)

const showSidePanel = ref(false)

watch(
  () => showSidePanel.value,
  async show => {
    if (show) {
      await refreshLocalFiles()
    }
  }
)

const backHome = () => {
  router.replace({ path: '/' })
}
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
        <div v-if="changed" style="padding-right: 10px;">有改动 记得保存 -> </div>
        <div class="editor-tool-bar-item" @click="saveToDb">
          <save-icon/>
        </div>
        <div class="editor-tool-bar-item" @click="saveAs">
          另存为
        </div>
      </div>
    </header>
    <div class="rule-compiler-content">
      <aside>
        <div
          class="left-aside-panel"
        >
          <div class="left-aside-bar">
            <div
              class="left-aside-bar-btn"
              :style="{
                background: showSidePanel ? '#2a2a2a': ''
              }"
              @click="() => {
                showSidePanel = !showSidePanel
              }"
            >
              <file-icon size="x-large"/>
            </div>
          </div>
          <div
            v-show="showSidePanel"
            class="left-aside-content"
          >
            <div></div>
            <div style="padding: 10px;">
              <div
                v-for="f in localFiles"
                :key="f.uid"
                class="local-file-card"
              >
                <div style="display: flex">
                  <div style="width: 70%;">
                    <div
                      style="display: inline-block; width: 10px; height: 10px; background: #48b883; border-radius: 5px;"
                      v-show="file.uid === f.uid"
                    />
                    {{f.name}}
                  </div>
                  <div style="flex: 1; display: flex; flex-direction: row-reverse;">
                    <edit-icon style="cursor: pointer" @click="() => {editFrom(f.uid)}"/>
                  </div>
                </div>
                <div style="margin-top: 10px; font-size: small;">
                  {{f.content.length > 100 ? f.content.slice(0, 100) + '...' : f.content}}
                </div>
              </div>
            </div>
          </div>
        </div>
      </aside>
      <main>
        <wx-monaco
          style="flex: 2; height: calc(100vh - 64px)"
          :theme="TellerRuleLang.themeName"
          :language="TellerRuleLang.id"
          :value="file.content"
          @change="handleSourceChange"
        />
        <div style="flex: 1;">
          <div>{{output}}</div>
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

.left-aside-panel {
  height: 100%;
  display: flex;

  .left-aside-bar {
    display: flex;
    flex-direction: column;
    border-right: @panel-border;
  }

  .left-aside-bar-btn {
    cursor: pointer;
    padding: 10px;
  }

  .left-aside-content {
    height: 100%;
    background: #2a2a2a;
    width: 256px;
    border-right: @panel-border;
    overflow: scroll;
    scrollbar-width: none;
  }
}

.local-file-card {
  margin-top: 10px;
  border-radius: 4px;
  padding: 10px;
  background: black;
}

main {
  display: flex;
  flex: 1;
}

.rule-compiler-monaco {
  flex: 1;
}
</style>
