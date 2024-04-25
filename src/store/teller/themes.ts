export interface ReadingThemeInterface {
  font: string
  bg: string
  panel: string
  highlight: string
  name: string
}

export const presetThemes: ReadingThemeInterface[] = [
  {
    font: '#2e2e30',
    panel: '#fcfcfc',
    bg: '#f5f5f5',
    highlight: '#07a0ff',
    name: 'light'
  },
  {
    font: '#888b8b',
    panel: '#303031',
    bg: '#252526',
    highlight: '#1bb0f8',
    name: 'dark',
  },
  {
    font: '#6b3b21',
    panel: '#efddbf',
    bg: '#f6ddb2',
    highlight: '#b86134',
    name: 'yellow'
  },
  {
    font: '#305038',
    panel: '#e7fbe4',
    bg: '#d5efd2',
    highlight: '#83cc7b',
    name: 'green',
  },
  {
    font: '#a2b2c4',
    panel: '#294362',
    bg: '#293a4e',
    highlight: '#8aaad0',
    name: 'blue',
  },
  {
    font: '#425a34',
    panel: '#fbfffa',
    bg: '#f2fcf2',
    highlight: '#6d9952',
    name: 'light-green'
  },
  {
    font: '#d6a78e',
    panel: '#644c41',
    bg: '#584238',
    highlight: '#d1865b',
    name: 'coffee'
  },
  {
    font: '#833140',
    panel: '#fbe9eb',
    bg: '#ffecee',
    highlight: '#ad5d6b',
    name: 'pink'
  },
  {
    font: '#32302c',
    panel: '#faf6e8',
    bg: '#f4eedc',
    highlight: '#b77c19',
    name: 'light-yellow',
  },
]

export const defaultTheme = presetThemes[0]

export const themeMap = new Map(presetThemes.map(it => [it.name, it]))
