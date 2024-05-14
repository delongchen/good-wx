<script setup lang="ts">
import { DeleteIcon, FileAddIcon } from 'tdesign-icons-vue-next'
import {useEditing} from "@/store/rule-compiler/editor.ts";
import LocalRuleFileCard from "@/pages/rule-compiler/aside-bar/LocalRuleFileCard.vue";
import {ref} from "vue";

const {
  localFiles,
  refreshLocalFiles,
  newSource,
  editFrom,
  deleteSourceFile,
} = useEditing()

refreshLocalFiles()

const deleteMode = ref(false)

const handleCardAction = async (uid: number, action: string) => {
  if (action === 'edit') {
    await editFrom(uid)
  }

  if (action === 'delete') {
    await deleteSourceFile(uid)
  }
}

const addNewFile = () => {
  newSource(true)
}
</script>

<template>
  <div style="width: 256px; height: 100%; overflow: scroll; scrollbar-width: none;">
    <div
      style="
        display: flex;
        flex-direction: row-reverse;
        background-color: #19191c;
        padding: 10px;
      "
    >
      <div
        class="tool-bar-item"
        :style="{
          color: deleteMode ? 'red': '',
        }"
        @click="deleteMode = !deleteMode"
      >
        <delete-icon/>
      </div>
      <div
        class="tool-bar-item"
        @click="addNewFile"
      >
        <file-add-icon/>
      </div>
    </div>
    <div style="padding: 10px;">
      <local-rule-file-card
        v-for="file in localFiles"
        :key="file.uid"
        :file="file"
        :delete-mode="deleteMode"
        @action="handleCardAction"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
.tool-bar-item {
  margin-left: 10px;
  cursor: pointer;
}
</style>
