import {StaticData} from "@/store/resonances/static";

const { nameMap } = StaticData

export interface RGoodsAsyncInfo {
  price: number
  trend: number
  time: number
  limit: number
  profit: number
}

export interface RGoodsBaseInfo {
  cityId: number
  cityName: string
  goodsId: number
  goodsName: string
}

const emptyBaseInfo: () => RGoodsAsyncInfo = () => ({
  price: 0,
  trend: 0,
  time: 0,
  limit: 0,
  profit: 0,
})

export class RGoodsInfo {
  constructor(
    public buyInfo: RGoodsAsyncInfo,
    public saleInfo: RGoodsAsyncInfo[],
    public baseInfo: RGoodsBaseInfo,
  ) {}
}

export const emptyInfoVec = () => {
  const result: RGoodsInfo[] = []
  let goodsId = 0

  for (let i = 0; i < nameMap.length; i++) {
    for (let j = 0; j < nameMap[i][1].length; j++) {
      const baseInfo: RGoodsBaseInfo = {
        cityId: i,
        cityName: nameMap[i][0],
        goodsId,
        goodsName: nameMap[i][1][j]
      }

      result.push(
        new RGoodsInfo(
          emptyBaseInfo(),
          Array.from({length: nameMap.length}, emptyBaseInfo),
          baseInfo
        )
      )

      goodsId += 1
    }
  }

  return result
}
