import {computed} from "vue";
import {goodsCount} from "@/store/resonances/static";

export const useGoodsSelector = (
  get: () => number[],
  set: (value: number[]) => void
) => {
  const source = computed({get, set})

  const selectedGoodsSet = computed(() => new Set(source.value))

  const select = (id: number) => {
    const old = selectedGoodsSet.value
    if (selectedGoodsSet.value.has(id)) {
      old.delete(id)
    } else {
      old.add(id)
    }
    source.value = [...old]
  }
  const selectAll = () => {
    source.value = Array.from({length: goodsCount}, (_, index) => index)
  }
  const unselectAll = () => {
    source.value = []
  }
  const hasSelected = (id: number) => {
    return selectedGoodsSet.value.has(id)
  }
  return {
    select,
    selectAll,
    unselectAll,
    hasSelected,
  }
}
