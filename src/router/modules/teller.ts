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
  },
  {
    name: 'book-detail',
    path: '/teller/book-detail',
    component: () => import('@/pages/teller/BookDetailPage.vue'),
    meta: {
      hideTabBar: true
    }
  },
  {
    name: 'book-index',
    path: '/teller/book-index',
    component: () => import('@/pages/teller/BookIndexPage.vue'),
    meta: {
      hideTabBar: true
    }
  },
  {
    name: 'reading',
    path: '/teller/reading',
    component: () => import('@/pages/teller/ReadingPage.vue'),
    meta: {
      hideTabBar: true
    }
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
