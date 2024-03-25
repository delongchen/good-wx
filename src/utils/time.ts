export const timeDistance = (time: number) => {
  const now = Date.now()
  const diff = now - time

  if (diff < (60 * 1000)) {
    return '刚刚'
  } else if (diff < (60 * 60 * 1000)) {
    return `${(diff / (60 * 1000)) >> 0}分钟前`
  } else {
    return '已过期'
  }
}

export const sleep = (n: number) => new Promise<void>(resolve => {
  setTimeout(resolve, n)
})
