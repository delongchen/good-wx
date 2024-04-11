const BaseUrl = 'http://localhost:11451'

export const join = (...part: (string | number)[]) => {
  return [BaseUrl, ...part].join('/')
}

export const sub = (name: string | number) => {
  const _join = (...part: (string | number)[]) => {
    return join(name, ...part)
  }

  return {
    join: _join
  }
}
