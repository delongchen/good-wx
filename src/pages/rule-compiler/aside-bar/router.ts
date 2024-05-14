import {
  FileIcon,
  TemplateIcon,
} from 'tdesign-icons-vue-next'
import LocalRuleFiles from "@/pages/rule-compiler/aside-bar/LocalRuleFiles.vue";

interface AsideBarRouteRaw {
  name: string
  content?: any
  icon: any
}

const router: AsideBarRouteRaw[] = [
  {
    name: 'local-files',
    icon: FileIcon,
    content: LocalRuleFiles
  },
  {
    name: 'rule-template',
    icon: TemplateIcon,
  }
]

export const routesMap = new Map(router.map(it => [it.name, it]))
export const icons = [...routesMap.values()].map(it => ({
  name: it.name,
  component: it.icon,
}))
