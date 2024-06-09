<script setup lang="ts">
import {RuleRenderInfo} from "@/store/teller/rules";
import { DownloadIcon, RefreshIcon, MoreIcon } from 'tdesign-icons-vue-next'

const props = defineProps<{
  rule: RuleRenderInfo
}>()

const emits = defineEmits<{
  action: [name: string, uid: number]
}>()

const handleMore = () => {
  emits('action', 'more', props.rule.uid)
}

const handleDownload = () => {
  emits('action', 'download', props.rule.uid)
}
</script>

<template>
  <div
    class="teller-rule-card"
  >
    <div style="display: flex">
      <div style="font-weight: bold;">{{props.rule.name}}</div>
      <div
        v-if="props.rule.downloaded"
        class="rule-status-tag"
        style="background-color: #48b883"
      >已下载</div>
      <div
        v-if="props.rule.updatable"
        style="background-color: coral"
        class="rule-status-tag"
      >可更新</div>
    </div>
    <div style="padding: 10px 0 25px 0;">
      {{props.rule.desc.slice(0, 101)}}
      {{props.rule.desc.length > 100 ? '...': ''}}
    </div>
    <div
      style="
        display: flex;
        justify-content: space-around;
        color: #676868;
        font-size: small;
      "
    >
      <div @click="handleMore">
        <more-icon/>
        详情
      </div>
      <div
        v-if="!props.rule.downloaded"
        @click="handleDownload"
      >
        <download-icon/>
        下载
      </div>
      <div
        v-if="props.rule.updatable"
        @click="handleDownload"
      >
        <refresh-icon/>
        更新
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.teller-rule-card {
  width: 100%;
  padding: 10px;
  border-radius: 5px;
  background-color: white;
}

.rule-status-tag {
  margin-left: 4px;
  color: white;
  font-size: small;
  padding: 0 4px 0 4px;
  border-radius: 2px;
}
</style>
