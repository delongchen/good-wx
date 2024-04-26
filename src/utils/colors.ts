// #RGB
// #RGBA
// #RRGGBB
// #RRGGBBAA

import {basisOf, moduleOf} from "@/utils/vector.ts";

const fmtRGBHex = (hex: string): string | null => {
  if (!hex.startsWith('#')) return null

  hex = hex.slice(1)

  if (hex.length === 3) {
    hex += 'f'
  }

  if (hex.length === 4) {
    hex = [...hex].map(it => it.repeat(2)).join('')
  }

  if (hex.length === 6) {
    hex += 'ff'
  }

  if (hex.length !== 8) {
    return null
  }

  return hex
}

const fmtColorValue = (value: number) => {
  value = Math.round(value)
  if (value < 0) return 0
  if (value > 255) return 255
  return value
}

interface ColorMeta {
  norm: number
  basis: [number, number, number]
  maxNorm: number
}

export class ColorHelper {
  private meta!: ColorMeta

  constructor(
    private red: number = 255,
    private green: number = 255,
    private blue: number = 255,
    private alpha: number = 255,
  ) {
    this.updateMeta()
  }

  private updateMetaNorm() {
    this.meta.norm = moduleOf([this.red, this.green, this.blue])
  }

  private updateMeta() {
    const {red, green, blue} = this
    const vec = [red, green, blue]
    const norm = moduleOf(vec)
    const basis = basisOf(vec, norm) as [number, number, number]
    const maxNorm = 255 / Math.max(...basis)

    this.meta = {
      norm,
      basis,
      maxNorm,
    }
  }

  static fromHex(raw: string): ColorHelper {
    const hex = fmtRGBHex(raw)
    if (hex === null) return new ColorHelper

    const red = parseInt(hex.slice(0, 2), 16)
    const green = parseInt(hex.slice(2, 4), 16)
    const blue = parseInt(hex.slice(4, 6), 16)
    const alpha = parseInt(hex.slice(6, 8), 16)

    if ([red, green, blue, alpha].some(isNaN)) {
      return new ColorHelper
    }

    return new ColorHelper(red, green, blue, alpha)
  }

  clone() {
    return new ColorHelper(this.red, this.green, this.blue, this.alpha)
  }

  toHex() {
    return '#' + [this.red, this.green, this.blue, this.alpha]
      .map(v => {
        const s = v.toString(16)
        if (s.length === 1) {
          return '0' + s
        }
        return s
      })
      .join('')
  }

  linearAdd(increment: number): ColorHelper {
    const { meta: {basis} } = this
    this.red = fmtColorValue(this.red + basis[0] * increment)
    this.green = fmtColorValue(this.green + basis[1] * increment)
    this.blue = fmtColorValue(this.blue + basis[2] * increment)
    this.updateMetaNorm()
    return this
  }

  lighter(percentage: number = 10): ColorHelper {
    return this.linearAdd((percentage / 100) * this.meta.maxNorm)
  }

  darker(percentage: number = 5): ColorHelper {
    return this.linearAdd(-(percentage / 100) * this.meta.maxNorm)
  }

  static between(a: string | ColorHelper, b: string | ColorHelper) {
    if (typeof a === 'string') a = ColorHelper.fromHex(a)
    if (typeof b === 'string') b = ColorHelper.fromHex(b)

    return new ColorHelper(
      Math.round((a.red + b.red) / 2),
      Math.round((a.green + b.green) / 2),
      Math.round((a.blue + b.blue) / 2),
    )
  }

  static basisBetween(a: string | ColorHelper, b: string | ColorHelper) {
    if (typeof a === 'string') a = ColorHelper.fromHex(a)
    if (typeof b === 'string') b = ColorHelper.fromHex(b)

    const c_basis: [number, number, number] = [
      (a.meta.basis[0] + b.meta.basis[0]) / 2,
      (a.meta.basis[1] + b.meta.basis[1]) / 2,
      (a.meta.basis[2] + b.meta.basis[2]) / 2,
    ]

    const c_norm = (a.meta.norm + b.meta.norm) / 2

    return new ColorHelper(
      Math.round(c_basis[0] * c_norm),
      Math.round(c_basis[1] * c_norm),
      Math.round(c_basis[2] * c_norm),
    )
  }
}
