import * as keys from '@/store/keys'
import {useLocalStorage} from "@vueuse/core";

interface AppInfo {
  version: string
}

const newAppInfo = (): AppInfo => ({
  version: '0.0.2'
})

const latestAppInfo = newAppInfo()

const appStore = useLocalStorage(keys.app, newAppInfo())

let updated = false
export const isAppUpdated = () => updated

export const checkUpdate = () => {
  if (
    latestAppInfo.version !== appStore.value.version
  ) {
    updated = true
    appStore.value = latestAppInfo
  }
}
