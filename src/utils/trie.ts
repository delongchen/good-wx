export class TrieNode<T> {
  children: Map<string, TrieNode<T>> = new Map
  value: string = ''
  payload: T | null = null

  constructor(value?: string) {
    if (value !== undefined) {
      this.value = value
    }
  }

  private _insert(key: string, payload: T) {
    let cur: TrieNode<T> = this

    for (const char of key) {
      const exist = cur.children.get(char)
      if (exist !== undefined) {
        cur = exist
        continue
      }

      const newNode = new TrieNode<T>(char)
      cur.children.set(char, newNode)
      cur = newNode
    }

    cur.payload = payload
  }

  insert(key: string, payload: T) {
    if (key.length === 0) return
    this._insert(key, payload)
  }
}

