import {RouteRecordRaw} from "vue-router";

const AboutRouter: RouteRecordRaw[] = [
  {
    path: '/about',
    component: () => import('@/pages/about/AboutPage.vue'),
    meta: {
      title: '#about',
      weight: -1,
    }
  }
]

export default AboutRouter
