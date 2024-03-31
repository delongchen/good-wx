import {RouteRecordRaw} from "vue-router";

export const TellerSubRouter: RouteRecordRaw[] = [
  {
    path: '/teller/library',
    component: () => import('@/pages/teller/TellerLibraryPage.vue'),
    meta: {
      index: 0,
      text: '#library',
    },
  },
  {
    path: '/teller/shop',
    component: () => import('@/pages/teller/TellerShopPage.vue'),
    meta: {
      index: 1,
      text: '#shop',
    },
  },
  {
    path: '/teller/rule',
    component: () => import('@/pages/teller/TellerRulePage.vue'),
    meta: {
      index: 2,
      text: '#rule',
    },
  },
  {
    path: '/teller/home',
    component: () => import('@/pages/teller/TellerHomePage.vue'),
    meta: {
      index: 3,
      text: '#home',
    },
  }
]

const tellerRouter: RouteRecordRaw[] = [
  {
    path: '/teller',
    component: () => import('@/pages/teller/TellerPage.vue'),
    meta: {
      title: '#teller',
      singlePage: true
    },
    redirect: '/teller/library',
    children: TellerSubRouter
  }
]

export default tellerRouter
