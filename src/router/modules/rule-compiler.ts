import {RouteRecordRaw} from "vue-router";

const ruleCompilerRouter: RouteRecordRaw[] = [
  {
    path: '/rule-compiler',
    component: () => import('@/pages/rule-compiler/RuleCompilerPage.vue'),
    meta: {
      title: '规则编译',
      singlePage: true,
    }
  }
]

export default ruleCompilerRouter
