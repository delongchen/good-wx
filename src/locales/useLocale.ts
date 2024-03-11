import {useI18n} from "vue-i18n";
import { langCodeSet, DefaultLang } from './index.ts'
import {useLocalStorage} from "@vueuse/core";
import * as storeKeys from '../../../../../Desktop/charger/src/store/keys.ts'

export const useLocale = () => {
  const { locale, t } = useI18n({useScope: 'global'})
  const localeStore = useLocalStorage(storeKeys.locale, DefaultLang)

  const changeLocale = (lang: string) => {
    if (!langCodeSet.has(lang)) {
      lang = DefaultLang
    }

    locale.value = lang
    localeStore.value = lang
  }

  const getT = (prefix: string = '') => {
    if (prefix === '') return (key: string) => t(key)
    return (key: string) => t(`${prefix}.${key}`)
  }

  return {
    changeLocale,
    getT
  }
}
