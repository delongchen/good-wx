export const debounce = (fn: Function, delay: number) => {
  let timer: any = null

  return (...args: any[]) => {
    if (timer !== null) {
      clearTimeout(timer)
    }

    timer = setTimeout(() => {
      fn(...args)
    }, delay)
  }
}
