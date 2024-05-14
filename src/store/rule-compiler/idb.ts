import * as keys from '../keys'
import Dexie, { Table } from "dexie";
import { TellerRuleSource } from "@/types/rule-compiler";

class EditorDb extends Dexie {
  files!: Table<TellerRuleSource>

  constructor() {
    super(keys.ruleCompiler.editor);
    this.version(1).stores({
      files: '&uid',
    })
  }
}

const db = new EditorDb()

export const getAllFiles = () => {
  return db.transaction('r', db.files, trans => {
    return trans.files.toArray()
  })
}

export const getFileByUid = (uid: number) => {
  return db.transaction('r', db.files, trans => {
    return trans.files.get(uid)
  })
}

export const updateFile = (file: TellerRuleSource) => {
  return db.transaction('rw', db.files, async trans => {
    const exist = await trans.files.get(file.uid)
    if (exist !== undefined && exist.latest !== file.latest) {
      await trans.files.update(file.uid, file)
    } else {
      await trans.files.put(file)
    }
  })
}

export const deleteFile = (uid: number) => {
  return db.transaction('rw', db.files, async trans => {
    return trans.files.delete(uid)
  })
}
