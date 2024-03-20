<script setup lang="ts">
import WxBaseCard from "@/components/wx/WxBaseCard.vue";

const props = defineProps<{
  title?: string,
  subTitle?: string,
}>()
</script>

<template>
  <wx-base-card>
    <div class="wx-card-header" v-if="props.title">
      <div class="wx-card-header-title">
        <div class="wx-card-header-title-text">{{props.title}}</div>
        <div class="wx-card-header-actions"><slot name="actions"/></div>
      </div>
      <div class="wx-card-header-sub-title">{{props.subTitle}}</div>
    </div>
    <div class="wx-card-content"><slot name="content"/></div>
  </wx-base-card>
</template>

<style scoped lang="less">
@import "@/style/preset";

@wch: wx-card-header;

.@{wch} {
  margin-bottom: @app-space;
}

.@{wch}-title {
  display: flex;
  justify-content: space-between;
  align-items: center;

  .@{wch}-title-text {
    font-size: xx-large;
  }
}

.@{wch}-actions {
  display: flex;
}

.@{wch}-sub-title {
  color: #8f8f8f;
}
</style>
