import {useI18n} from "vue-i18n";
import { langCodeSet, DefaultLang } from './index.ts'
import {useLocalStorage} from "@vueuse/core";
import * as storeKeys from '../../../../../Desktop/charger/src/store/keys.ts'

export const useLocale = () => {
  const { locale } = useI18n({useScope: 'global'})
  const localeStore = useLocalStorage(storeKeys.locale, DefaultLang)

  const changeLocale = (lang: string) => {
    if (!langCodeSet.has(lang)) {
      lang = DefaultLang
    }

    locale.value = lang
    localeStore.value = lang
  }

  return {
    locale,
    changeLocale
  }
}
