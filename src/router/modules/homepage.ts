import {RouteRecordRaw} from "vue-router";
import AppLayout from "@/layouts/AppLayout.vue";
import MuYu from "@/pages/home/MuYu.vue";
import {defineCSS} from "@/utils/type.ts";

const homepageRouter: RouteRecordRaw[] = [
  {
    path: '/home',
    component: AppLayout,
    redirect: '/home/muyu',
    meta: {
      style: defineCSS({
        backgroundColor: '#38393a'
      })
    },
    children: [
      {
        path: 'muyu',
        component: MuYu
      }
    ]
  }
]

export default homepageRouter
