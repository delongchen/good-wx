export interface StringScope {
  start: number
  end: number
  slice: boolean
}

export type StrRefMap = Record<string, string>

export type StrGetter = (refMap: StrRefMap) => string

export type StrGroup = (string | StrGetter)[]
