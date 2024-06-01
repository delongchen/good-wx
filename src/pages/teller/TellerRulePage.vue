<script setup lang="ts">
import {useRule} from "@/store/teller/rules";
import TellerRuleCard from "@/pages/teller/components/TellerRuleCard.vue";
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()

const {
  localRules,
  remoteRules,
  refreshRules,
  downloadRule,
} = useRule()

refreshRules()

const headerKeys = ['发现', '已下载']
const selectedKey = ref(0)

const handleAction = (action: string, uid: number) => {
  if (action === 'more') {
    router.push({
      name: 'rule-detail',
      query: {
        uid,
        from: selectedKey.value === 0 ? 'remote': 'local'
      },
    })
    return
  }

  if (action === 'download') {
    downloadRule(uid)
  }
}
</script>

<template>
  <div>
    <header>
      <div
        v-for="(text, index) in headerKeys"
        :key="index"
        style="margin-right: 10px;"
        :style="{
          borderBottom: '2px solid',
          borderColor: selectedKey === index ? '#48b883': 'white',
          fontWeight: selectedKey === index ? 'bold': null,
          color: selectedKey === index ? 'black': 'gray'
        }"
        @click="() => { selectedKey = index }"
      >{{text}}</div>
    </header>

    <div
      style="padding: 58px 10px 0 10px;"
    >
      <teller-rule-card
        v-for="rule in selectedKey !== 0 ? localRules : remoteRules"
        :key="rule.uid"
        :rule="rule"
        style="margin-bottom: 10px;"
        @action="handleAction"
      />
    </div>
  </div>
</template>

<style scoped lang="less">
header {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 48px;
  background-color: white;
  padding: 10px;

  display: flex;
}
</style>
