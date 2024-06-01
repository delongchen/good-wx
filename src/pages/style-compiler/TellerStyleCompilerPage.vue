<script setup lang="ts">
import WxMonaco from "@/components/monaco/WxMonaco.vue";
import {useLocalStorage} from "@vueuse/core";
import { debounce } from "@/utils/fn";
import * as yaml from 'yaml'
import {ref} from "vue";

const local = useLocalStorage(
  'teller-style-compiler',
  {
    text: ''
  }
)

const output = ref('')

const handleChange = debounce((value: string) => {
  local.value.text = value

  try {
    output.value = JSON.stringify(yaml.parse(value), null, 2)
  } catch (e: any) {
    console.error(e)
  }
}, 250)
</script>

<template>
  <div
    style="
      width: 100vw;
      height: 100vh;
      display: flex;
    "
  >
    <wx-monaco
      language="yaml"
      style="width: 50vw;"
      :value="local.text"
      @change="handleChange"
    />
    <div style="
      width: 50vw;
      height: 100%;
      background-color: #181818;
      color: white;
      padding: 10px;
      overflow: scroll;
    ">
      <pre>{{output}}</pre>
    </div>
  </div>
</template>

<style scoped lang="less">
</style>
