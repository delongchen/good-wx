import {RouteRecordRaw} from "vue-router";
import RootPage from "@/pages/root/RootPage.vue";

const homepageRouter: RouteRecordRaw[] = [
  {
    path: '/home',
    component: RootPage
  }
]

export default homepageRouter
