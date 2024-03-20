<script setup lang="ts">
import { ListIcon } from 'tdesign-icons-vue-next'
import {computed, ref} from "vue";
import {allRoutes} from "@/router";
import {useLocale} from "@/locales/useLocale.ts";
import WxButton from "@/components/wx/WxButton.vue";
import WxTitle from "@/components/wx/WxTitle.vue";
import {useRoute, useRouter} from "vue-router";

const { getT } = useLocale()
const t = getT('router')

const router = useRouter()
const route = useRoute()
const pushPath = (path: string) => {
  router.push({path})
    .finally(() => {
      scroll({
        top: 0,
        left: 0,
      })
    })
}

const actionList = computed(() => {
  return allRoutes
    .filter(item => typeof item?.meta?.title === 'string')
    .map(item => {
      const ret = {
        path: item.path,
        title: item.meta!.title! as string,
        weight: <number>item.meta?.weight ?? 0,
      }

      if (ret.title.startsWith('#')) {
        ret.title = t(ret.title.slice(1))
      }

      return ret
    })
    .sort((a, b) => b.weight - a.weight)
})
const showVerticalActions = ref(false)
</script>

<template>
  <div class="app-header">
    <div class="app-header-title">
      <wx-title
        text="wu#xiang#smart#boy"
        end-with="_"
        upper-size="xx-large"
        @click="pushPath('/')"
      />
    </div>
    <div class="app-header-actions">
      <div class="app-header-actions-horizontal">
        <div
          v-for="(action, key) in actionList"
          :class="{
            'app-header-selected-action': route.path.startsWith(action.path),
            'app-header-action': true,
          }"
          :key="key"
          style="margin-left: 18px;"
        >
          <wx-button @click="pushPath(action.path)">{{action.title}}</wx-button>
        </div>
      </div>

      <div
        class="app-header-actions-vertical-btn"
        @click="showVerticalActions = !showVerticalActions"
      >
        <list-icon
          style="color: white;"
          size="x-large"
        />
      </div>

      <div
        class="app-header-actions-vertical"
        v-show="showVerticalActions"
      >

      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

@panel: app-header;

.@{panel} {
  height: 81px;
  display: flex;
  padding: 0 @app-space 0 @app-space;
  align-items: center;
  justify-content: space-between;
  background-color: @app-black;
  border-bottom: 1px solid @app-black-lighter;
}

.@{panel}-title {
  margin-left: @app-space * 3;
  @media @max960 {
    margin: 0;
  }
}

.@{panel}-action {
  border-bottom: 2px solid @app-black;
}

.@{panel}-selected-action {
  border-color: #48b883;
}

@actions: app-header-actions;
@actions-v: app-header-actions-vertical;
@actions-h: app-header-actions-horizontal;

.@{actions} {
  position: relative;

  .@{actions-h} {
    display: flex;
    @media @max960 {
      display: none;
    }
  }

  .@{actions-v}-btn {
    display: block;
    cursor: pointer;
    @media @min960 {
      display: none;
    }
  }

  .@{actions-v} {
    position: absolute;
    right: 0;
    top: 150%;
    width: 200px;
    height: 300px;
    background-color: white;
    @media @min960 {
      display: none;
    }
  }
}
</style>
