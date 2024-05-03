<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import {useCacheManager} from "@/core/teller/cache-manage.ts";
import {computed} from "vue";
import WxCard from "@/components/wx/WxCard.vue";

const {
  updateCacheInfo,
  cacheInfoMap,
  clearAllCache,
  status,
} = useCacheManager()

const cacheInfoList = computed(() => {
  return [...cacheInfoMap.value.values()]
})

const clearAll = async () => {
  await clearAllCache()
  await updateCacheInfo()
}

updateCacheInfo()
</script>

<template>
  <teller-sub-layout show-header title="缓存管理">
    <div
      style="padding: 10px;"
      v-if="cacheInfoList.length !== 0"
    >
      <div
        @click="updateCacheInfo"
        class="line-btn"
        style="background-color: #48b883;"
      >{{status === 0 ? '刷新': '加载中'}}</div>
      <div
        @click="clearAll"
        class="line-btn"
        style="background-color: #c90303"
      >删除全部</div>

      <div style="margin-top: 10px;">
        <wx-card
          class="cache-info-card"
          v-for="item in cacheInfoList"
          :key="item.meta.uid"
          :title="item.meta.name"
          :sub-title="item.record?.title"
          title-size="large"
        >
          <template #content>
            <div v-if="item.chapter !== undefined">
              <div>
                已下载{{item.chapter.count}}章
              </div>
              <div>
                共{{item.chapter.size}}字
              </div>
            </div>
            <div v-else>未下载</div>
          </template>

          <template #actions>
            <div
              class="line-btn"
              style="background-color: #c90303; margin: 0;"
            >
              删除
            </div>
          </template>
        </wx-card>
      </div>
    </div>
    <div v-else>
      书架没东西哇
    </div>

  </teller-sub-layout>
</template>

<style scoped lang="less">
.cache-info-card {
  background-color: white;
}

.line-btn {
  color: white;
  margin-top: 10px;
  text-align: center;
  border-radius: 4px;
  padding: 10px;
}
</style>
