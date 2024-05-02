import {ref, Ref, watchEffect} from "vue";
import {useElementBounding, useWindowSize} from "@vueuse/core";

export const enum ElementPosition {
  NoHeight,
  UnderView,
  OverView,
  TopInView,
  BottomInView,
  BodyInView,
}

export const useElementPosition = (
  el: Ref<HTMLDivElement | null>
) => {
  const windowSize = useWindowSize()
  const bounding = useElementBounding(el)
  const position = ref<ElementPosition>(ElementPosition.NoHeight)

  const stop = watchEffect(() => {
    const elH = bounding.height.value
    if (elH === 0) {
      position.value = ElementPosition.NoHeight
      return
    }

    const windowH = windowSize.height.value
    const top = bounding.top.value
    const bottom = bounding.bottom.value

    if (top > windowH) {
      position.value = ElementPosition.UnderView
      return
    }

    if (bottom < 0) {
      position.value = ElementPosition.OverView
      return
    }

    if (
      top > 0 &&
      top < windowH &&
      bottom > windowH
    ) {
      position.value = ElementPosition.TopInView
      return
    }

    if (
      top < 0 &&
      bottom > 0 &&
      bottom < windowH
    ) {
      position.value = ElementPosition.BottomInView
      return
    }

    if (top < 0 && bottom > windowH) {
      position.value = ElementPosition.BodyInView
      return
    }
  })

  return {
    position,
    stop,
  }
}
