import * as idb from './idb'
import {TellerRuleMeta, TellerRuleRaw, TellerRuleReplacement,} from "@/types/teller/books.ts";
import {computed, ref, watch} from "vue";
import {useLocalStorage} from "@vueuse/core";
import * as keys from '../keys'
import {TrieNode} from "@/utils/trie.ts";
import {getRuleByUid} from "./idb";

const testData: [string, string | null][] = [["萧炎","吴翔"],["萧薰儿","吴梓熙"],["萧潇","吴潇"],["萧霖","吴霖"],["萧晨","吴晨"],["萧战","吴战"],["萧鼎","吴鼎"],["萧厉","吴厉"],["萧林","吴林"],["萧宁","吴宁"],["萧媚","吴媚"],["萧玉","吴玉"],["萧族",null],["萧盟","吴盟"],["炎儿","翔子"],["薰儿","梓熙"],["药尘","郭尘"],["药星极","郭星极"],["药万归","郭万归"],["药老","郭老"],["药族","郭族"],["药帮","郭帮"],["彩鳞","张主管"],["美杜莎","张主管"],["小医仙","小仙女"],["纳兰嫣然","毛gay"],["纳兰桀",null],["嫣然","玉桤"],["云韵",null],["云山",null],["云帆",null],["青鳞",null],["青海",null],["紫妍",null],["米特尔","比亚迪"],["雅妃","华为"],["海波东","扎克脖割"],["古河",null],["古灵",null],["古妖",null],["古青阳",null],["古元",null],["林修崖",null],["林焱",null],["琥嘉",null],["琥乾",null],["韩月",null],["韩枫",null],["韩闲",null],["韩池",null],["韩雪",null],["韩田",null],["韩冲",null],["苏千",null],["苏笑",null],["苏媚",null],["慕青鸾",null],["慕骨",null],["慕桑",null],["剑尊者",null],["黄泉尊者",null],["雷尊者",null],["铁剑尊者",null],["唐震",null],["唐火儿",null],["曹休",null],["曹颖",null],["曹单",null],["黑、白天尊",null],["黑天尊",null],["白天尊",null],["火云老祖",null],["丹塔老祖",null],["穆力","勃起"],["罗布",null],["罗侯",null],["罗成",null],["蒙喇",null],["蒙力",null],["圣耀鼎",null],["黑魔鼎",null],["万兽鼎",null],["山熔鼎",null],["异火","异屌"],["帝炎","帝屌"],["虚无吞炎","虚无吞屌"],["金帝焚天炎","金帝焚天屌"],["九幽风炎","九幽风屌"],["火云水炎","火云水屌"],["陨落心炎","陨落心屌"],["风怒龙炎","风怒龙屌"],["阴阳双炎","阴阳双屌"],["玄黄炎","玄黄屌"],["净莲妖火","净莲妖屌"],["九幽金祖火","九幽金祖屌"],["九龙雷罡火","九龙雷罡屌"],["三千焱炎火","三千焱炎屌"],["红莲业火","红莲业屌"],["骨灵冷火","骨灵冷屌"],["龟灵地火","龟灵地屌"],["青莲地心火","青莲地心屌"],["幽冥毒火","幽冥毒屌"],["万兽灵火","万兽灵屌"],["生灵之焱","生灵之屌"],["八荒破灭焱","八荒破灭屌"],["海心焰","海心屌"],["火山石焰","火山石屌"],["斗气","翔气"],["斗之气","翔之气"],["斗者","翔者"],["斗师","翔师"],["斗灵","翔灵"],["斗王","翔王"],["斗皇","翔皇"],["斗宗","翔宗"],["斗尊","翔尊"],["斗圣","翔圣"],["斗帝","翔帝"],["一品丹药","一品壮阳药"],["二品丹药","二品壮阳药"],["三品丹药","三品壮阳药"],["四品丹药","四品壮阳药"],["五品丹药","五品壮阳药"],["六品丹药","六品壮阳药"],["七品丹药","七品壮阳药"],["八品丹药","八品壮阳药"],["九品丹药","九品壮阳药"],["帝品丹药","帝品壮阳药"],["丹药","壮阳药"],["炎盟",null],["天府联盟",null],["蛇人族部落",null],["黑角域",null],["迦南学院",null],["磐门",null],["白帮",null],["月灵",null],["狼牙",null],["烈山",null],["魂殿",null],["丹塔",null],["加玛帝国",null],["出云帝国",null],["落雁帝国",null],["慕兰帝国",null],["天蛇帝国",null],["花宗",null],["云岚宗",null],["天冥宗",null],["毒宗",null],["金雁宗",null],["焚炎谷",null],["冰河谷",null],["慕兰谷",null],["星陨阁",null],["风雷阁",null],["万剑阁",null],["黄泉阁",null],["魂族",null],["炎族",null],["古族",null],["雷族",null],["石族",null],["灵族",null],["太虚古龙族",null],["九幽地冥蟒族",null],["天妖凰族",null]]
const replacements = testData.map<[string, TellerRuleReplacement]>(it => {
  return [it[0], { value: it[1], classes: [] }]
})

const fetchMockRules = (timeout: number = 250) => {
  return new Promise<TellerRuleRaw[]>(resolve => {
    setTimeout(() => {
      const result: TellerRuleRaw[] = []
      const now = 11451
      for (let i = 0; i < 20; i++) {
        result.push({
          uid: now + i,
          latest: now + i + 1,
          desc: `mock rule raw ${i}`,
          name: `rule raw ${i}`,
          entries: replacements,
        })
      }
      resolve(result)
    }, timeout)
  })
}

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
        result.push(matchResult.payload)
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
    const remote = await fetchMockRules()

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
