import {ref} from "vue";
import {sleep} from "@/utils/time.ts";
import {
  RGoodsInfo,
  emptyInfoVec,
  RGoodsAsyncInfoRaw
} from './type'

const infoVec: RGoodsInfo[] = emptyInfoVec()

export const infoVecRef = ref(infoVec)

export const latestUpdate = ref(0)

const decodeBuffer = (buf: ArrayBuffer): [number, RGoodsAsyncInfoRaw[][]] => {
  const v = new DataView(buf)

  const result: RGoodsAsyncInfoRaw[][] = []
  const cityNum = v.getUint8(0)
  const goodsNum = v.getUint8(1)
  const itemSize = v.getUint8(2)
  const latest = v.getFloat64(4)
  if (latest === latestUpdate.value) {
    return [latest, result]
  }

  const lineSize = (cityNum + 1) * itemSize + 2
  const bodyStart = 12

  for (let goodsIndex = 0; goodsIndex < goodsNum; goodsIndex++) {
    const lineStart = bodyStart + lineSize * goodsIndex
    const lineData: RGoodsAsyncInfoRaw[] = []
    const trendVec = v.getUint16(lineStart)

    for (let itemIndex = 0; itemIndex < cityNum + 1; itemIndex++) {
      const offset = lineStart + 2 + itemIndex * itemSize

      const price = v.getUint8(offset)
      const limit = v.getUint8(offset + 1)
      const profit = v.getInt16(offset + 2)
      const h = v.getUint8(offset + 4)
      const m = v.getUint8(offset + 5)
      const s = v.getUint8(offset + 6)
      const date = new Date()
      date.setHours(h)
      date.setMinutes(m)
      date.setSeconds(s)
      const time = date.getTime()
      const trend = (trendVec & (1 << itemIndex)) === 0 ? 0 : 1

      lineData.push({
        price, trend, time, limit, profit
      })
    }

    result.push(lineData)
  }

  return [latest, result]
}

const fetchGoodsBaseInfo = (): Promise<ArrayBuffer | null> =>
  fetch(
    //'https://api.cnmd.life/wxsb/resonance/goods'
    'http://localhost:11451/resonance/goods'
  )
    .then(res => res.arrayBuffer())
    .catch(() => null)

const updateAsyncInfo = (next: RGoodsAsyncInfoRaw, old: RGoodsAsyncInfoRaw) => {
  old.price = next.price
  old.trend = next.trend
  old.time = next.time
  old.limit = next.limit
  old.profit = next.profit
}

const updateGoodsInfo = async () => {
  const raw = await fetchGoodsBaseInfo()
  if (raw === null) return

  const [latest, infoMap] = decodeBuffer(raw)
  if (latest === latestUpdate.value) {
    return
  }

  for (let line = 0; line < infoVec.length; line++) {
    const old = infoVec[line]
    const next = infoMap[line]

    const nextSale = next.slice(1)
    const oldSale = old.saleInfo
    let maxLimit = Number.MIN_SAFE_INTEGER
    for (let city = 0; city < oldSale.length; city++) {
      if (nextSale[city].limit > maxLimit) {
        maxLimit = nextSale[city].limit
      }
      if (oldSale[city].time !== nextSale[city].time) {
        updateAsyncInfo(
          nextSale[city],
          infoVecRef.value[line].saleInfo[city]
        )
      }
    }

    next[0].limit = maxLimit
    if (old.buyInfo.time !== next[0].time) {
      updateAsyncInfo(
        next[0],
        infoVecRef.value[line].buyInfo
      )
    }
  }

  latestUpdate.value = latest
}

export const startGoodsUpdateLoop = async () => {
  while (true) {
    await updateGoodsInfo()
    await sleep(1000 * 60)
  }
}
