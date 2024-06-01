<script setup lang="ts">
import {useRule} from "@/store/teller/rules.ts";
import {ref} from "vue";
import {useReadingSetting} from "@/store/teller/reading.ts";
import {CheckIcon} from 'tdesign-icons-vue-next'

const {
  refreshLocalRuleMap,
  localRuleMap,
  activatingRuleUid,
  setActivatingRule,
} = useRule()

const {
  theme,
} = useReadingSetting()

const localRules = ref<{name: string, uid: number}[]>([])

refreshLocalRuleMap()
  .then(() => {
    localRules.value = [...localRuleMap.values()].map(it => {
      return {
        name: it.name,
        uid: it.uid,
      }
    })
  })

const handleRuleSelect = (uid: number) => {
  if (uid === activatingRuleUid.value) {
    setActivatingRule(0)
  } else {
    setActivatingRule(uid)
  }
}
</script>

<template>
  <div>
    <div>
      <div
        v-for="rule in localRules"
        :key="rule.uid"
        class="rule-setting-select"
        @click="() => { handleRuleSelect(rule.uid) }"
        :style="{
          color: rule.uid === activatingRuleUid ? theme.highlight : theme.font,
          backgroundColor: rule.uid === activatingRuleUid ? theme.bg : null
        }"
      >
        <div>{{rule.name}}</div>
        <div>
          <check-icon v-show="activatingRuleUid === rule.uid"/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.rule-setting-select {
  display: flex;
  justify-content: space-between;
  padding: 10px;
}
</style>
