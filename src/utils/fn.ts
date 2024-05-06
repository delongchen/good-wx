export const debounce = (fn: Function, n = 100) => {
  let handle: number | null = null
  return (...args: any[]) => {
    if (handle !== null) clearTimeout(handle)
    handle = window.setTimeout(() => {
      fn(...args)
    }, n)
  }
}
