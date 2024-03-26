import {RGoodsAsyncInfo, RGoodsInfo} from "@/store/resonances/type";

type RGoodsSortFn = (a: RGoodsInfo, b: RGoodsInfo) => number
type RGoodsSortAsyncFn = (a: RGoodsAsyncInfo, b: RGoodsAsyncInfo) => number

interface RGoodsSort {
  whole: RGoodsSortFn,
  sale: RGoodsSortAsyncFn,
  text: string,
  id: string,
}

type ItemValueGetter = (item: RGoodsAsyncInfo) => number
type WholeValueGetter = (whole: RGoodsInfo) => number

const iGetters: Record<string, ItemValueGetter> = {
  price: it => it.price,
  profit: it => it.profit * it.limit,
  profitUnit: it => it.profit
}

const findMaxSaleItem = (
  items: RGoodsAsyncInfo[],
  getter: (v: RGoodsAsyncInfo) => number
) => {
  items = Array.from(items)
  items.sort((a, b) => getter(b) - getter(a))
  return getter(items[0])
}

const createWholeSortFn = (
  getter: WholeValueGetter,
  up: boolean = false
): RGoodsSortFn => {
  if (up) {
    return (a, b) =>
      getter(a) - getter(b)
  }

  return (a, b) =>
    getter(b) - getter(a)
}

const createSaleSortFn = (
  getter: ItemValueGetter,
  up: boolean = false
): RGoodsSortAsyncFn => {
  if (up) {
    return (a, b) => getter(a) - getter(b)
  } else {
    return (a, b) => getter(b) - getter(a)
  }
}

const sortList: RGoodsSort[] = [
  {
    id: 'max-price',
    text: '最大利润差',
    whole: createWholeSortFn(item => {
      const maxPrice = findMaxSaleItem(item.saleInfo, iGetters.price)
      return maxPrice - item.buyInfo.price
    }),
    sale: createSaleSortFn(iGetters.price)
  },
  {
    id: 'max-rating',
    text: '最大平均利润率',
    whole: createWholeSortFn(item => {
      return item.rating()
    }),
    sale: createSaleSortFn(iGetters.price)
  },
  {
    id: 'max-profit',
    text: '最大单票利润',
    whole: createWholeSortFn(item => {
      return findMaxSaleItem(item.saleInfo, iGetters.profit)
    }),
    sale: createSaleSortFn(iGetters.profit)
  },
  {
    id: 'max-profit-unit',
    text: '最大单位利润',
    whole: createWholeSortFn(item => {
      return findMaxSaleItem(item.saleInfo, iGetters.profitUnit)
    }),
    sale: createSaleSortFn(iGetters.profitUnit)
  }
]

export const presetSorts = new Map<string, RGoodsSort>(
  sortList.map(it => [it.id, it])
)
