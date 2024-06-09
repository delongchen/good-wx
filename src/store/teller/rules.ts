import * as idb from './idb'
import {TellerRuleMeta, TellerRuleRaw, TellerRuleReplacement,} from "@/types/teller/books.ts";
import {computed, ref, watch} from "vue";
import {useLocalStorage} from "@vueuse/core";
import * as keys from '../keys'
import {TrieNode} from "@/utils/trie.ts";
import {getRuleByUid} from "./idb";
import {fetchRules} from "@/api/books.ts";

export interface RuleRenderInfo extends TellerRuleMeta {
  updatable: boolean
  downloaded: boolean
}

interface RuleLocalSetting {
  ruleUid: number
}

const localRules = ref<RuleRenderInfo[]>([])
const localRuleMap = new Map<number, TellerRuleRaw>()
const remoteRules = ref<RuleRenderInfo[]>([])
const remoteRuleMap = new Map<number, TellerRuleRaw>()

const localSetting = useLocalStorage<RuleLocalSetting>(
  keys.teller.ruleSetting,
  () => {
    return {
      ruleUid: 0,
    }
  }
)

const activatingRuleUid = computed(() => localSetting.value.ruleUid)
const setActivatingRule = (uid: number) => {
  localSetting.value.ruleUid = uid
}
type ReplaceFnType = (text: string) => TellerRuleReplacement[]
const DoNothingReplaceFn: ReplaceFnType = (text) => [{value: text, classes: []}]
const replaceFn = ref<ReplaceFnType>(DoNothingReplaceFn)
const createReplaceFn = (raw: TellerRuleRaw): ReplaceFnType => {
  const ruleTrie = TrieNode.from(raw.entries)

  return (text: string) => {
    const result: TellerRuleReplacement[] = []
    let start = 0
    let cur = start

    const commit = () => {
      if (start !== cur) {
        result.push({
          value: text.slice(start, cur),
          classes: []
        })
      }
    }

    while (cur < text.length) {
      const input = text.slice(cur)
      const matchResult = ruleTrie.maxMatch(input)
      if (matchResult !== null) {
        commit()

        const {payload, matched} = matchResult
        if (payload.value === null) {
          result.push({
            value: matched,
            classes: payload.classes
          })
        } else {
          result.push(matchResult.payload)
        }

        cur += matchResult.matched.length
        start = cur
      } else {
        cur += 1
      }
    }

    commit()
    return result
  }
}

watch(
  () => localSetting.value.ruleUid,
  async uid => {
    if (uid === 0) {
      replaceFn.value = DoNothingReplaceFn
      return
    }

    const exist = await getRuleByUid(uid)
    if (exist === undefined) {
      replaceFn.value = DoNothingReplaceFn
      return
    }

    replaceFn.value = createReplaceFn(exist)
  },
  { immediate: true }
)

export const useRule = () => {
  const refreshLocalRuleMap = async (rules?: TellerRuleRaw[]) => {
    rules ??= await idb.getAllRules()
    localRuleMap.clear()
    for (const rule of rules) {
      localRuleMap.set(rule.uid, rule)
    }
  }

  const refreshRules = async () => {
    const local = await idb.getAllRules()
    const remote = await fetchRules()

    await refreshLocalRuleMap(local)

    remoteRuleMap.clear()
    const newRemoteRules: RuleRenderInfo[] = []
    for (const rule of remote) {
      const { uid, name, desc, latest } = rule
      remoteRuleMap.set(uid, rule)
      newRemoteRules.push({
        uid,
        name,
        desc,
        latest,
        downloaded: localRuleMap.has(uid),
        updatable: false,
      })
    }
    remoteRules.value = newRemoteRules

    const newLocalRules: RuleRenderInfo[] = []
    for (const rule of local) {
      const { uid, name, desc, latest } = rule
      const remoteExist = remoteRuleMap.get(uid)
      const updatable = remoteExist !== undefined && remoteExist.latest > latest
      newLocalRules.push({
        uid,
        name,
        desc,
        latest,
        updatable,
        downloaded: true,
      })
    }
    localRules.value = newLocalRules
  }

  const downloadRule = async (uid: number) => {
    const remoteExist = remoteRuleMap.get(uid)
    if (remoteExist === undefined) return

    const localExist = localRuleMap.get(uid)
    if (
      localExist !== undefined &&
      localExist.latest >= remoteExist.latest
    ) {
      return
    }

    await idb.insertRule(remoteExist)
    await refreshRules()
  }

  return {
    refreshRules,
    localRules,
    localRuleMap,
    remoteRules,
    remoteRuleMap,
    downloadRule,
    refreshLocalRuleMap,
    activatingRuleUid,
    setActivatingRule,
    replaceFn,
  }
}
