import type { StringScope } from "./types";

export const calculateStr = (source: string, scopes: StringScope[]) => {
  if (scopes.length === 0) return source

  for (const scope of scopes) {
    if (source === '') return ''

    const {start, end, slice} = scope

    if (!slice) {
      if (isNaN(start)) return ''
      source = source[start] ?? ''
      continue
    }

    const _start = isNaN(start) ? 0 : +start
    const _end = isNaN(end) ?
      source.length
      :
      end < 0 ?
        source.length + end
        :
        end

    source = source.slice(_start, _end)
  }

  return source
}
