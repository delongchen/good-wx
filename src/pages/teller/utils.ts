export const fmtCharNum = (num: number) => {
  if (num < 100) {
    return `${num}`
  } else if (num < 1000) {
    return `${(num / 100) >> 0}百`
  } else if (num < 10000) {
    return `${(num / 1000) >> 0}千`
  } else {
    return `${(num / 10000) >> 0}万`
  }
}
