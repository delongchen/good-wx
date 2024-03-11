<script setup lang="ts">
import {langList} from "@/locales";
import {useLocale} from "@/locales/useLocale";
import {ref} from "vue";
import {useRouter} from "vue-router";

const router = useRouter()
const {changeLocale, getT} = useLocale()

const showLangSelector = ref(false)

const changeLang = (lang: string) => {
  changeLocale(lang)
  showLangSelector.value = false
}

const goHome = () => {
  router.push('/').then(() => {
    scroll({
      top: 0,
    })
  })
}

const t = getT('layout.app.header')
</script>

<template>
  <header>
    <div class="header-content">
      <div class="header-title">
        <div class="logo" @click="goHome">{{ t('title') }}_</div>
      </div>
      <div class="header-actions">
        <div class="header-action-item">
          <div class="lang-selector-btn" @click="showLangSelector = !showLangSelector">{{ t('actions.lang') }}</div>
          <div
            class="lang-selector-items"
            v-show="showLangSelector"
            @mouseleave="showLangSelector = false"
          >
            <div
              v-for="(lang, key) in langList"
              :key="`lang-${key}`"
              class="lang-selector-item"
              @click="changeLang(lang.value)"
            >{{ lang.content }}
            </div>
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<style scoped lang="less">
header {
  flex: 0 0 81px;
  position: relative;
  border-bottom: 1px solid #94878e;
}

.header-content {
  position: absolute;
  color: #94878e;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: 90%;
  max-width: 1400px;
  display: flex;

  justify-content: space-between;
  align-items: center;
}

.logo {
  font-size: xx-large;
  cursor: pointer;
}

.lang-selector-btn {
  padding: 2px 4px 2px 4px;
  border: 1px solid #94878e;
  border-radius: 2px;
  cursor: pointer;

  &:hover {
    color: #38393a;
    background-color: #94878e;
  }
}

.lang-selector-items {
  position: absolute;
  right: 0;
  top: 100%;
  background-color: #38393a;
  padding: 10px;
  border: 1px solid #94878e;
  border-radius: 4px;

  display: flex;
  flex-direction: column;
}

.lang-selector-item {
  padding: 10px;
  cursor: pointer;

  &:hover {
    background-color: #5d5d62;
    color: #b689a9;
    border-radius: 4px;
  }
}
</style>
