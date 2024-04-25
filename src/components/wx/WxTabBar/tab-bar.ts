import {computed, ComputedRef, inject, provide, Ref, ref, useSlots} from 'vue'
import {findChildByName} from "@/utils/vnode.ts";

export interface TabBarProps {
  fixed?: boolean
  value?: number | string
}

interface TabBarInjection {
  parentProps: TabBarProps
  activeValue: Ref<string | number>
  updateChild: (currentValue: number | string) => void
  itemCount: ComputedRef<number>
  defaultIndex: Ref<number>
}

const TabBarSymbol = Symbol('wx-tab-bar')

export const tabBarProvide = (tabBarProps: TabBarProps) => {
  const slots = useSlots()

  const activeValue = ref<string | number>('')
  const updateChild = (currentValue: number | string) => {
    activeValue.value = currentValue
  }

  const itemCount = computed(() => {
    const nodes = slots?.default && slots.default()
    if (nodes === undefined) return 0

    return findChildByName('wx-tab-bar-item', nodes).length
  })

  const defaultIndex = ref(-1)

  provide<TabBarInjection>(TabBarSymbol, {
    parentProps: tabBarProps,
    activeValue,
    updateChild,
    itemCount,
    defaultIndex,
  })
}

export const tabBarInject = (): TabBarInjection => {
  return inject(TabBarSymbol)!
}
