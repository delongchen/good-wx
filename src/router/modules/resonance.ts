import {RouteRecordRaw} from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import {defineCSS} from "@/utils/type";

const resonancePageRouter: RouteRecordRaw[] = [
  {
    path: '/resonance',
    component: AppLayout,
    redirect: '/resonance/info',
    meta: {
      style: defineCSS({
        backgroundColor: 'black',
        color: 'white'
      })
    },
    children: [
      {
        path: 'info',
        component: () => import('@/pages/resonance/Resonance.vue')
      }
    ]
  }
]

export default resonancePageRouter
