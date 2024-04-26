type Vec = number[]

export const moduleOf = (vec: Vec) => {
  let powSum = 0
  for (const item of vec) {
    powSum += item ** 2
  }
  return Math.sqrt(powSum)
}

export const basisOf = (vec: Vec, mod?: number) => {
  mod ??= moduleOf(vec)
  return vec.map(it => it / mod)
}
