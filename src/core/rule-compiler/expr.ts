import {StrGetter, StrGroup, StrRefMap} from "@/core/rule-compiler/types";

class TellerRuleExpr {}

export class TellerRuleTerm extends TellerRuleExpr {
  private children: (string | StrGetter | TellerRuleTerm[])[] = []

  addChild(child: string | StrGetter | TellerRuleTerm[]) {
    this.children.push(child)
  }

  size() {
    return this.children.length
  }

  private preExpand(): [StrGroup[], boolean] {
    const { children } = this
    const stack: StrGroup = []
    let result: StrGroup[] = []
    let single = true

    const mergeStack = () => {
      if (stack.length === 0) return
      const temp: StrGroup = []

      for (const chunk of stack) {
        if (typeof chunk === 'string') {
          if (typeof temp[temp.length - 1] === 'string') {
            temp[temp.length - 1] += chunk
            continue
          }
        }
        temp.push(chunk)
      }

      if (result.length !== 0) {
        for (const item of result) {
          item.push(...temp)
        }
      } else {
        result.push(temp)
      }

      stack.length = 0
    }

    for (const child of children) {
      if (Array.isArray(child)) {
        single = false

        if (child.length === 0) continue

        mergeStack()

        const childStrGroups: StrGroup[] = []
        for (const term of child) {
          childStrGroups.push(...term.preExpand()[0])
        }
        if (childStrGroups.length === 0) continue

        if (result.length === 0) {
          result = childStrGroups
          continue
        }

        const newStrGroups: StrGroup[] = []
        for (const old of result) {
          for (const group of childStrGroups) {
            newStrGroups.push([
              ...old,
              ...group,
            ])
          }
        }
        result = newStrGroups
      } else {
        stack.push(child)
      }
    }

    mergeStack()

    return [result, single]
  }

  expand(previous: string[] = [], isInput: boolean = false): string[] {
    const result: string[] = []

    let [preExpanded, single] = this.preExpand()

    if (single) {
      preExpanded = Array.from({
        length: isInput ? 1 : previous.length
      }, () => preExpanded[0])
    }

    for (let i = 0; i < preExpanded.length; i++) {
      let str = ''
      const refMap: StrRefMap = {
        prev: previous[i]
      }
      for (const chunk of preExpanded[i]) {
        if (typeof chunk === 'string') {
          str += chunk
        } else {
          str += chunk(refMap)
        }
      }

      result.push(str)
    }

    return result
  }
}
