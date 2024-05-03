<script setup lang="ts">
import {useRouter} from "vue-router";
import WxCellGroup from "@/components/wx/WxCell/WxCellGroup.vue";
import WxCell from "@/components/wx/WxCell/WxCell.vue";

const router = useRouter()

const pushRoute = (name: string) => {
  router.push({ name })
}
</script>

<template>
  <div
    class="teller-home-page"
  >
    <div style="height: 30vh;"></div>
    <div>
      <wx-cell-group title="常规设置">
        <wx-cell
          title="缓存管理"
          arrow
          @click="() => { pushRoute('cache-manager') }"
        />
      </wx-cell-group>
    </div>
  </div>
</template>

<style scoped lang="less">
.teller-home-page {
  padding: 10px;
}
</style>
