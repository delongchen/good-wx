const APP_KEY = 'cnmd'

const createSubKey = (...keys: string[]) => {
  return [APP_KEY, ...keys].join('-')
}

export const app = createSubKey('application')
export const locale = createSubKey('locale')
export const resonance = {
  setting: createSubKey('resonance', 'setting')
}
export const teller = {
  history: createSubKey('teller', 'history')
}
