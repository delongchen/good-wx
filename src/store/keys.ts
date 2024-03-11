const APP_KEY = 'cnmd'

const createSubKey = (...keys: string[]) => {
  return [APP_KEY, ...keys].join('-')
}

export const locale = createSubKey('locale')
