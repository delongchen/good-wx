import {RouteRecordRaw} from "vue-router";

const resonancePageRouter: RouteRecordRaw[] = [
  {
    path: '/resonance',
    redirect: '/resonance/goods',
    component: () => import('@/pages/resonance/Resonance.vue'),
    meta: {
      title: '#resonance'
    },
    children: [
      {
        path: 'goods',
        component: () => import('@/pages/resonance/RGoods.vue')
      },
      {
        path: 'goods-city',
        component: () => import('@/pages/resonance/RGoodsCity.vue')
      },
      {
        path: 'goods-favorite',
        component: () => import('@/pages/resonance/RGoodsFavorite.vue')
      }
    ]
  }
]

export default resonancePageRouter
