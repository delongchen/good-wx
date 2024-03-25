import {RouteRecordRaw} from "vue-router";

const tellerRouter: RouteRecordRaw[] = [
  {
    path: '/teller',
    component: () => import('@/pages/teller/TellerPage.vue'),
    meta: {
      title: '#teller',
      singlePage: true
    }
  }
]

export default tellerRouter
