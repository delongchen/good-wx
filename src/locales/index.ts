import { useLocalStorage, usePreferredLanguages } from '@vueuse/core'
import * as storeKeys from '@/store/keys'
import { MessageType } from "./type";
import { createI18n } from 'vue-i18n'

export const DefaultLang = 'zh_CN'

const langModules = import.meta.glob('./lang/**/index.ts', { eager: true })
const messages: MessageType = {}
export const langList: {content: string, value: string}[] = []
export const langCodeSet: Set<string> = new Set

const getLocale = (def: string) => {
  const fromLocal = useLocalStorage(storeKeys.locale, def).value
  const fromPreferred = usePreferredLanguages().value[0]

  return fromLocal ?? (fromPreferred ?? def)
}

// todo: too ugly, will rewrite
const initLangModules = () => {
  const modPaths = Object.keys(langModules)

  for (const modPath of modPaths) {
    const pathList = modPath.split('/')
    const [_, langCode] = [pathList.pop(), pathList.pop()!]
    const mod = Reflect.get(langModules, modPath)
    if (typeof mod === 'object' && mod !== null) {
      const defaultExports = Reflect.get(mod, 'default')
      if (typeof defaultExports === 'object' && defaultExports !== null) {
        langCodeSet.add(langCode)
        langList.push({
          content: defaultExports?.lang ?? '',
          value: langCode
        })
        messages[langCode] = defaultExports
      }
    }
  }
}
initLangModules()

export const i18n = createI18n({
  messages: messages as any,
  legacy: false,
  locale: getLocale(DefaultLang),
  fallbackLocale: DefaultLang,
  globalInjection: true,
})

