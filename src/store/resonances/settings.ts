import {useLocalStorage} from "@vueuse/core";
import * as keys from '@/store/keys'
import {isAppUpdated} from "@/store/app.ts";

interface RSetting {
  sortID: string
  excludeGoods: number[]
  favoriteGoods: number[]
}

const defaultSetting: () => RSetting =
  () => ({
    sortID: 'max-price',
    excludeGoods: [
      3, 4, 5, 11, 12, 18,
      19, 24, 31, 32, 33, 38,
      43, 48, 49, 53
    ],
    favoriteGoods: []
  })

export const setting = useLocalStorage(keys.resonance.setting, defaultSetting())

if (isAppUpdated()) {
  setting.value.sortID = 'max-price'
  setting.value.favoriteGoods = []
}

export const setToDefault = () => {
  setting.value = defaultSetting()
}
