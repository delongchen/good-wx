import { TellerRuleSource } from "@/types/rule-compiler";
import * as keys from '../keys'
import {computed, ref} from "vue";
import {useLocalStorage} from "@vueuse/core";
import {getAllFiles, getFileByUid, updateFile} from "./idb.ts";

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

export const useEditing = () => {
  const changed = ref(false)
  const localFiles = ref<TellerRuleSource[]>([])

  const refreshLocalFiles = async () => {
    localFiles.value = (await getAllFiles()
      .catch(() => []))
      .sort((a, b) => b.latest - a.latest)
  }

  const file = computed(() => {
    return {
      content: editeHistory.value.content,
      uid: editeHistory.value.uid,
      name: editeHistory.value.name,
    }
  })

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
    changed.value = false
    await refreshLocalFiles()
  }

  const saveAs = async () => {
    const empty = emptySource()
    empty.latest = editeHistory.value.latest
    empty.name = editeHistory.value.name
    empty.content = editeHistory.value.content

    await updateFile(empty)
    editeHistory.value.uid = empty.uid
    changed.value = false
    await refreshLocalFiles()
  }

  const editFrom = async (uid: number) => {
    const exist = await getFileByUid(uid)
    if (exist !== undefined) {
      editeHistory.value = exist
    }
    changed.value = false
  }

  return {
    file,
    setFileContent,
    setFileName,
    updateFileLatest,
    changed,
    saveToDb,
    saveAs,
    localFiles,
    refreshLocalFiles,
    editFrom,
  }
}
