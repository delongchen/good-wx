// #RGB
// #RGBA
// #RRGGBB
// #RRGGBBAA
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
  value >>= 0
  if (value < 0) return 0
  if (value > 255) return 255
  return value
}

type RGB = 'red' | 'green' | 'blue'
type RGBA = RGB | 'alpha'

export class ColorHelper {
  constructor(
    private red: number = 255,
    private green: number = 255,
    private blue: number = 255,
    private alpha: number = 255,
  ) {}

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

  setValue(key: RGBA, value: number): ColorHelper {
    this[key] = fmtColorValue(value)
    return this
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

  add(key: RGBA, value: number) {
    return this.setValue(key, this[key] + value)
  }

  addRGB(value: number): ColorHelper {
    for (const key of ['red', 'green', 'blue'] as RGB[]) {
      this.add(key, value)
    }
    return this
  }
}
