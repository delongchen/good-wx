import {RGoodsAsyncInfo, RGoodsAsyncInfoPlus, RGoodsInfo} from "@/store/resonances/type";

type RGoodsSortFn = (a: RGoodsInfo, b: RGoodsInfo) => number
type RGoodsSortAsyncFn = (a: RGoodsAsyncInfoPlus, b: RGoodsAsyncInfoPlus) => number

interface RGoodsSort {
  whole: RGoodsSortFn,
  sale: RGoodsSortAsyncFn,
  text: string,
  id: string,
}

const findMaxSaleItem = (
  items: RGoodsAsyncInfo[],
  getter: (item: RGoodsAsyncInfo) => number
) => {
  items.sort((a, b) => getter(b) - getter(a))
  return items[0]
}

const sortList: RGoodsSort[] = [
  {
    id: 'max-price',
    text: '最大差价',
    whole: (a, b) => {
      const aMax = findMaxSaleItem(a.saleInfo, it => it.price)
      const bMax = findMaxSaleItem(b.saleInfo, it => it.price)
      return (bMax.price - b.buyInfo.price) - (aMax.price - a.buyInfo.price)
    },
    sale: (a, b) => {
      return b.price - a.price
    }
  }
]

export const presetSorts = new Map<string, RGoodsSort>(
  sortList.map(it => [it.id, it])
)
