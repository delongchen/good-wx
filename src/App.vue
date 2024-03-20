<script setup lang="ts">
import {useRoute} from "vue-router";
import AppDefaultLayout from "@/layouts/AppDefaultLayout.vue";

const route = useRoute()
</script>

<template>
  <router-view v-if="route?.meta?.singlePage === true"/>
  <app-default-layout v-else />
</template>

<style scoped lang="less">
</style>
