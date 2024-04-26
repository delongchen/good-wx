<script setup lang="ts">
import {useReadingSetting} from "@/store/teller/reading.ts";
import {computed} from "vue";
import {ColorHelper} from "@/utils/colors.ts";
import {presetThemes} from "@/store/teller/themes.ts";

const {
  fontSize,
  setFontSize,
  theme,
  setThemeName,
} = useReadingSetting()

const canFontSizeReduce = computed(() => {
  return fontSize.value > 12
})
const canFontSizeAdd = computed(() => {
  return fontSize.value < 40
})
const reduceFontSize = () => {
  if (canFontSizeReduce.value)
    setFontSize(fontSize.value - 2)
}
const addFontSize = () => {
  if (canFontSizeAdd.value)
    setFontSize(fontSize.value + 2)
}
const panelDarkerColor = computed(() => {
  return ColorHelper.fromHex(theme.value.panel)
    .darker()
    .toHex()
})
</script>

<template>
  <div
    class="setting-panel"
  >
    <div class="font-size-setting">
      <div>字号</div>
      <div
        @click="reduceFontSize"
        class="setting-btn"
        style="font-weight: bold;"
        :style="{ backgroundColor: panelDarkerColor }"
        :class="{
          'font-size-setting-btn-disable': !canFontSizeReduce
        }"
      >A-</div>
      <div>{{fontSize}}</div>
      <div
        @click="addFontSize"
        class="setting-btn"
        style="font-weight: bold;"
        :style="{ backgroundColor: panelDarkerColor }"
        :class="{
          'setting-btn-disable': !canFontSizeAdd
        }"
      >A+</div>
    </div>

    <div
      class="colors-setting"
    >
      <div
        v-for="item in presetThemes"
        :key="item.name"
        :style="{
          backgroundColor: item.bg,
          border: `2px solid ${item.name === theme.name ? theme.highlight : item.bg}`
        }"
        @click="() => { setThemeName(item.name) }"
        class="preset-color-item"
      ></div>
    </div>

    <div
      class="more-setting"
      :style="{
        borderTop: `1px solid ${panelDarkerColor}`
      }"
    >
      <div
        class="setting-btn"
        :style="{ backgroundColor: panelDarkerColor }"
      >开启护眼</div>
      <div
        class="setting-btn"
        :style="{ backgroundColor: panelDarkerColor }"
      >更多设置</div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.font-size-setting {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.setting-btn {
  padding: 10px @app-space*1.5 10px @app-space*1.5;
  border-radius: @app-space;
}

.setting-btn-disable {
  color: #aeafaf;
}

.colors-setting {
  padding: 10px;
  display: flex;
  overflow: scroll;
  scrollbar-width: none;

  .preset-color-item {
    flex: 0 0 48px;
    margin: 5px;
    width: 48px;
    height: 48px;
    border-radius: 24px;
  }
}

.more-setting {
  padding: @app-space 10px 0 10px;
  display: flex;
  font-size: large;
  justify-content: space-around;
}
</style>
