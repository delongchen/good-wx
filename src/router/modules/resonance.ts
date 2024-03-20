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
      }
    ]
  }
]

export default resonancePageRouter
