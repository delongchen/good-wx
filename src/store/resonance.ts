import {ref} from "vue";
import {sleep} from "@/utils/time";

//const ResonanceAPI = 'http://localhost:11451/resonance'
const ResonanceAPI = 'https://api.cnmd.life/wxsb/resonance'
const subApi = (path: string) => `${ResonanceAPI}/${path}`

export const goodsNameMap = ref<Map<number, { name: string, city: number }>>(new Map)
export const cityNameMap = ref<Map<number, string>>(new Map)
export const distanceMap = ref<number[][]>([])

export interface RGoodsInfoType {
  price: number
  trend: PriceTrend
  time: number
}

export const enum PriceTrend {
  Up,
  Down,
  Zero
}

export interface MostValueInfo {
  from: {
    info: RGoodsInfoType,
    id: number,
  },
  to: {
    info: RGoodsInfoType,
    id: number
  },
  profit: number
}

export const mostValueGoods = ref<MostValueInfo[]>([])

const sortFn = (a: MostValueInfo, b: MostValueInfo) => {
  return (
    (b.to.info.price / b.from.info.price)
    -
    (a.to.info.price / a.from.info.price)
  )
}

export const updateMostValueGoods = () =>
  fetch(subApi('goods/mv'))
    .then(res => res.json() as Promise<MostValueInfo[]>)
    .then(data => {
      data.sort(sortFn)
      mostValueGoods.value = data
    })
    .catch(() => {
    })


const fetchNameMap = () =>
  fetch(subApi('namemap'))
    .then(res => res.json() as Promise<[string, string[]][]>)
    .then(m => {
      let cityKey = 0
      let goodsKey = 0
      for (const item of m) {
        cityNameMap.value.set(cityKey, item[0])
        for (const goods of item[1]) {
          goodsNameMap.value.set(goodsKey++, {city: cityKey, name: goods})
        }
        cityKey += 1
      }
    })

const fetchCityDistance = () =>
  fetch(subApi('distance'))
    .then(res => res.json())
    .then(data => {
      distanceMap.value = data
    })

const updateLoop = async () => {
  while (true) {
    await updateMostValueGoods()
    await sleep(60 * 1000)
  }
}

const initRStore = async () => {
  await fetchNameMap()
  await fetchCityDistance()
  updateLoop()
}

initRStore()
