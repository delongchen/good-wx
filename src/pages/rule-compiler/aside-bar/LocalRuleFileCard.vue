<script setup lang="ts">
import { CloseIcon, EditIcon } from 'tdesign-icons-vue-next'
import {TellerRuleSource} from "@/types/rule-compiler";
import { useEditingFile } from "@/store/rule-compiler/editor";
import {computed} from "vue";

const props = defineProps<{
  file: TellerRuleSource,
  deleteMode: boolean,
}>()

const editingFile = useEditingFile()

const isEditing = computed(() => {
  return props.file.uid === editingFile.value.uid
})

const emits = defineEmits<{
  action: [uid: number, action: string]
}>()

const handleDelete = () => {
  emits('action', props.file.uid, 'delete')
}

const handleEdit = () => {
  emits('action', props.file.uid, 'edit')
}
</script>

<template>
  <div class="local-rule-file-card">
    <div style="width: 100%; display: flex;">
      <div style="width: 80%">
        <div
          class="status-point"
          :style="{
            backgroundColor: isEditing ? '#48b883' : '',
          }"
        />
        <span>{{props.file.name}}</span>
      </div>
      <div style="flex: 1; display: flex; flex-direction: row-reverse;">
        <div
          v-if="props.deleteMode"
          style="cursor: pointer;"
          @click="handleDelete"
        ><close-icon/></div>
        <div
          @click="handleEdit"
          style="cursor: pointer;"
          v-if="!isEditing"
        ><edit-icon/></div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.local-rule-file-card {
  background-color: #181818;
  padding: 10px;
  border-radius: 4px;
  margin-bottom: 10px;
}

.status-point {
  display: inline-block;
  margin-right: 2px;
  width: 10px;
  height: 10px;
  border-radius: 5px;
}
</style>
