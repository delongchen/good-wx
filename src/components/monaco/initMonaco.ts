import * as monaco from 'monaco-editor'
import editorWorker from 'monaco-editor/esm/vs/editor/editor.worker?worker'
import * as TellerRuleLang from '@/core/monaco/lang/teller-rule'

let workerRegistered = false
const registerWorker = () => {
  if (workerRegistered) return
  self.MonacoEnvironment = {
    getWorker() {
      return new editorWorker()
    },
  }
  workerRegistered = true
}

const registeredLangSet = new Set<string>()
export const initMonaco = (lang?: string) => {
  registerWorker()
  if (lang === undefined || registeredLangSet.has(lang)) return

  monaco.languages.register({ id: TellerRuleLang.id })
  monaco.languages.setMonarchTokensProvider(TellerRuleLang.id, TellerRuleLang.getTokensProvider())
  monaco.editor.defineTheme(TellerRuleLang.themeName, TellerRuleLang.getThemeProvider())

  registeredLangSet.add(TellerRuleLang.id)
}
