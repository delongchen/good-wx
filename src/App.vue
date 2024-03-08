<script setup lang="ts">
import AppHeader from "./components/AppHeader.vue";
import AppFooter from "./components/AppFooter.vue";
import MUYU from './assets/my.png'
import * as counter from "./store/count";
import {debounce} from "./tools.ts";
import {computed, ref} from "vue";

const countRef = ref(0)
const timeout = 1000
const uploadCount = debounce(() => {
  counter.uploadCount(countRef.value)
  countRef.value = 0
}, timeout)

const clickMuyu = () => {
  uploadCount()
  countRef.value += 1
}

const showClickCounter = computed(() => countRef.value !== 0)

const newCountRef = ref(0)
const showNewCount = ref(false)
counter.onUpdate(async (latest, old) => {
  newCountRef.value = latest - old
  showNewCount.value = true
  setTimeout(() => {
    showNewCount.value =  false
  }, 500)
})
</script>

<template>
  <app-header/>
  <main>
    <div class="wx-desc">
      <p>{{$t('main.wx.desc.line1')}}</p>
      <p>{{$t('main.wx.desc.line2')}}</p>
      <p>{{$t('main.wx.desc.line3')}}</p>
      <p>{{$t('main.wx.desc.line4')}}</p>
    </div>
    <div class="muyu">
      <div class="muyu-panel">
        <img :src="MUYU" alt="muyu" @click="clickMuyu"/>
        <div
          class="muyu-click-counter"
          v-show="showClickCounter"
        >+ {{countRef}}</div>
      </div>
      <div style="position: relative">
        <p style="margin: 0;">{{$t('main.wx.count')}}: {{counter.state.global}}</p>
        <p
          style="position: absolute; right: 0; bottom: 100%; margin: 0;"
          v-show="showNewCount"
        >+ {{newCountRef}}</p>
      </div>
    </div>
  </main>
  <app-footer/>
</template>

<style scoped lang="less">
main {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: #94878e;
  flex: 1;
}

.wx-desc {
  margin-top: 40px;
  display: flex;
  flex-direction: column;
  align-items: center;

  p {
    font-size: large;
  }

  :last-child {
    font-size: xx-large;
  }
}

.muyu {
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-bottom: 40px;

  img {
    &:hover {
      cursor: pointer;
    }
    width: 60vw;
    max-width: 600px;
  }
}

.muyu-panel {
  position: relative;
  margin-bottom: 20px;

  .muyu-click-counter {
    position: absolute;
    top: 0;
    right: 0;
    font-size: larger;
  }
}
</style>
