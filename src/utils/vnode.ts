import {
  getCurrentInstance,
  VNode,
  isVNode,
  VNodeNormalizedChildren,
} from 'vue'

const recurChildren = (children?: VNodeNormalizedChildren): VNode[] => {
  const result: VNode[] = []

  if (Array.isArray(children)) {
    for (const child of children) {
      if (isVNode(child)) {
        result.push(child)

        if (child.component?.subTree) {
          result.push(child.component.subTree)
          result.push(...recurChildren(child.component.subTree.children))
        }

        if (child.children) {
          result.push(...recurChildren(child.children))
        }
      }
    }
  }

  return result
}

export const findChildByName = (name: string, children?: VNodeNormalizedChildren) => {
  children ??= getCurrentInstance()?.subTree.children

  return recurChildren(children)
    .filter(child => {
      if (typeof child.type === 'string') {
        return child.type === name
      } else if (typeof child.type === 'object') {
        return (
          Reflect.get(child.type, 'name') === name ||
          Reflect.get(child.type, '__name') === name
        )
      } else {
        return false
      }
    })
}
