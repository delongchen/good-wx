<script setup lang="ts">
import TellerSubLayout from "@/pages/teller/TellerSubLayout.vue";
import BookNotFound from "@/pages/teller/components/BookNotFound.vue";

</script>

<template>
  <teller-sub-layout
    title="目录"
  >
    <div v-if="true">
    </div>

    <book-not-found v-else/>

    <template #bar>

    </template>
  </teller-sub-layout>
</template>

<style scoped lang="less">

</style>
