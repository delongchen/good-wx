import {TellerRuleSource} from "@/types/rule-compiler";
import * as keys from '../keys'
import {computed, ref} from "vue";
import {useLocalStorage} from "@vueuse/core";
import {getAllFiles, getFileByUid, updateFile, deleteFile} from "./idb.ts";

const emptySource = (): TellerRuleSource => {
  const now = Date.now()
  return {
    content: '',
    uid: now,
    latest: now,
    name: 'untitled'
  }
}

const editeHistory = useLocalStorage<TellerRuleSource>(
  keys.ruleCompiler.editor,
  emptySource,
)

const localFiles = ref<TellerRuleSource[]>([])
const editorReadonly = ref(false)
const file = computed(() => {
  return {
    content: editeHistory.value.content,
    uid: editeHistory.value.uid,
    name: editeHistory.value.name,
  }
})

export const useEditingFile = () => file

export const useEditing = () => {
  const refreshLocalFiles = async () => {
    localFiles.value = (await getAllFiles()
      .catch(() => []))
      .sort((a, b) => b.latest - a.latest)
  }

  const setFileContent = (value: string) => {
    editeHistory.value.content = value
  }

  const setFileName = (value: string) => {
    editeHistory.value.name = value
  }

  const updateFileLatest = () => {
    editeHistory.value.latest = Date.now()
  }

  const saveToDb = async () => {
    await updateFile({
      uid: editeHistory.value.uid,
      name: editeHistory.value.name,
      content: editeHistory.value.content,
      latest: editeHistory.value.latest,
    })
    await refreshLocalFiles()
  }

  const saveAs = async () => {
    const empty = emptySource()
    empty.latest = editeHistory.value.latest
    empty.name = editeHistory.value.name
    empty.content = editeHistory.value.content

    await updateFile(empty)
    editeHistory.value.uid = empty.uid
    await refreshLocalFiles()
  }

  const editFrom = async (uid: number) => {
    if (editeHistory.value.uid === uid) return

    const exist = await getFileByUid(uid)
    if (exist !== undefined) {
      editeHistory.value = exist
    }
  }

  const newSource = async (save: boolean = true) => {
    if (save) {
      await saveToDb()
    }
    editeHistory.value = emptySource()
  }

  const deleteSourceFile = async (uid: number) => {
    if (uid === editeHistory.value.uid) {
      await newSource(false)
    }

    await deleteFile(uid)
    await refreshLocalFiles()
  }

  return {
    file,
    setFileContent,
    setFileName,
    updateFileLatest,
    saveToDb,
    saveAs,
    localFiles,
    refreshLocalFiles,
    editFrom,
    newSource,
    editorReadonly,
    deleteSourceFile,
  }
}
