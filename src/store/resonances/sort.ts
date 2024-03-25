import {RGoodsInfo} from "@/store/resonances/type";

type RGoodsSortFn = (a: RGoodsInfo, b: RGoodsInfo) => number

interface RGoodsSort {
  fn: RGoodsSortFn,
  text: string
}

export const NoSort: RGoodsSort = {
  fn: () => 0,
  text: 'no sort'
}

export const presetSorts: RGoodsSort[] = []
