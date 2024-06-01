export class TrieNode<T> {
  private children: Map<string, TrieNode<T>> = new Map
  private payload: T | null = null

  static from<V>(entries: [string, V][]) {
    const root = new TrieNode<V>()
    for (const entry of entries) {
      root.put(entry[0], entry[1])
    }
    return root
  }

  private _put(path: string, payload: T) {
    const root: TrieNode<T> = this
    let curNode = root

    for (const char of path) {
      const existChild = curNode.children.get(char)
      if (existChild === undefined) {
        const newNode = new TrieNode<T>()
        curNode.children.set(char, newNode)
        curNode = newNode
      } else {
        curNode = existChild
      }
    }

    curNode.payload = payload

    return root
  }

  put(path: string, payload: T) {
    return this._put(path, payload)
  }

  maxMatch(path: string) {
    const root: TrieNode<T> = this
    let curNode = root
    const stack: TrieNode<T>[] = []

    for (const char of path) {
      const existChild = curNode.children.get(char)
      if (existChild === undefined) {
        break
      }

      stack.push(existChild)
      curNode = existChild
    }

    while (stack.length !== 0) {
      const last = stack[stack.length - 1]
      if (last.payload === null) {
        stack.pop()
      } else {
        return {
          matched: path.slice(0, stack.length),
          payload: last.payload!
        }
      }
    }

    return null
  }
}
