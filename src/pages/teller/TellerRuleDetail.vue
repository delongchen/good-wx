<script setup lang="ts">
import {computed, ref, watch} from "vue";
import {useRoute} from "vue-router";
import {useRule} from "@/store/teller/rules";
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";

const route = useRoute()
const query = computed<{uid: number, from: 'local' | 'remote'}>(() => {
  const uidRaw = +(route.query.uid ?? '0')
  const fromRaw = route.query.from ?? ''

  const uid = isNaN(uidRaw) ? 0 : uidRaw
  const from = fromRaw === 'local' ? fromRaw : 'remote'

  return { uid, from }
})

const {
  remoteRuleMap,
  localRuleMap,
} = useRule()

const desc = ref('')
const li = ref<[string, string][]>([])

watch(
  () => query.value,
  info => {
    const map = info.from === 'remote' ? remoteRuleMap : localRuleMap
    const exist = map.get(info.uid)
    if (exist === undefined) return

    desc.value = exist.desc
    const { entries } = exist
    const filtered: [string, string][] = []
    for (const entry of entries) {
      if (entry[1].value !== null) {
        filtered.push([entry[0], entry[1].value])
      }
    }
    li.value = filtered
  },
  {
    immediate: true,
  }
)
</script>

<template>
  <teller-sub-layout
    show-header
  >
    <div style="padding: 10px;">
      <h2>描述:</h2>
      <div>{{desc}}</div>
      <h2>规则详细:</h2>
      <div
        v-for="(entry, index) in li"
        :key="index"
      >{{entry[0]}} -> {{entry[1]}}</div>
    </div>
  </teller-sub-layout>
</template>

<style scoped lang="less">

</style>
