import {RouteRecordRaw} from "vue-router";

const muyuRouter: RouteRecordRaw[] = [
  {
    path: '/muyu',
    component: () => import('@/pages/home/MuYu.vue'),
    meta: {
      title: '#muyu'
    }
  }
]

export default muyuRouter
