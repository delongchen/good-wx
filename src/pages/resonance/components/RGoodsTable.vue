<script setup lang="ts">
import { infoVecRef } from "@/store/resonances";
import {computed, reactive} from "vue";
import {presetSorts} from "@/store/resonances/sort";
import {RGoodsInfo} from "@/store/resonances/type.ts";
import RGoodsCard from "@/pages/resonance/components/RGoodsCard.vue";
import {setting, setToDefault} from "@/store/resonances/settings";
import WxButton from "@/components/wx/WxButton.vue";
import WxCard from "@/components/wx/WxCard.vue";
import { ChevronUpIcon, ChevronDownIcon, ChevronRightIcon, ChevronLeftIcon } from 'tdesign-icons-vue-next'
import {useGoodsSelector} from "@/store/resonances/hooks";
import RGoodsSelector from "@/pages/resonance/components/RGoodsSelector.vue";

const props = defineProps<{
  goodsSet: Set<number>
}>()

const goodsList = computed(() => {
  const sort = presetSorts.get(setting.value.sortID)
  const exclude = new Set(setting.value.excludeGoods)
  const favoriteSet = new Set(setting.value.favoriteGoods)
  const normal: RGoodsInfo[] = []
  const favorite: RGoodsInfo[] = []
  let rating = 0

  for (const index of props.goodsSet) {
    const goods = infoVecRef.value[index]

    if (goods !== undefined && !exclude.has(goods.baseInfo.goodsId)) {
      rating += goods.rating()
      if (favoriteSet.has(goods.baseInfo.goodsId)) {
        favorite.push(goods)
      } else {
        normal.push(goods)
      }
    }
  }

  if (sort !== undefined) {
    normal.sort(sort.whole)
    favorite.sort(sort.whole)
  }

  rating = (((rating / props.goodsSet.size) * 100) >> 0) / 100

  return {
    normal,
    favorite,
    rating
  }
})

const sortMethod = computed(() => {
  return presetSorts.get(setting.value.sortID)
})

const setSortMethod = (id: string) => {
  if (
    setting.value.sortID !== id &&
    presetSorts.has(id)
  ) {
    setting.value.sortID = id
  }
}

const showStatus = reactive({
  settingPanel: false,
  sortSetting: false,
  excludeSetting: false,
  favoriteSetting: false,
  moreGoods: false,
})

const excludeGoods = useGoodsSelector(
  () => setting.value.excludeGoods,
  value => {setting.value.excludeGoods = value}
)

const favoriteGoods = useGoodsSelector(
  () => setting.value.favoriteGoods,
  v => { setting.value.favoriteGoods = v }
)
</script>

<template>
  <div
    class="r-goods-card-line-btn"
    @click="showStatus.settingPanel = !showStatus.settingPanel"
  >
    设置
    <chevron-up-icon v-if="showStatus.settingPanel"/>
    <chevron-down-icon v-else/>
  </div>

  <div
    class="r-goods-table-setting"
    v-show="showStatus.settingPanel"
  >
    <wx-card
      title="排序方式"
      title-size="x-large"
      :sub-title="`当前: ${sortMethod?.text ?? ''}`"
    >
      <template #content>
        <div class="r-goods-table-setting-sort">
          <wx-button
            v-for="s in [...presetSorts.values()]"
            :key="s.id"
            @click="() => { setSortMethod(s.id) }"
          >{{s.text}}</wx-button>
        </div>
      </template>
    </wx-card>

    <wx-card
      title="忽略商品"
      title-size="x-large"
      header-margin="0"
      :sub-title="showStatus.excludeSetting ? '忽略你不想要的': ''"
      style="margin-top: 24px;"
    >
      <template #actions>
        <template v-if="showStatus.excludeSetting">
          <wx-button @click="excludeGoods.selectAll">全选</wx-button>
          <wx-button @click="excludeGoods.unselectAll">全不选</wx-button>
          <wx-button @click="showStatus.excludeSetting = false">
            <chevron-left-icon size="larger" />
          </wx-button>
        </template>
        <wx-button
          v-else
          @click="showStatus.excludeSetting = true"
        >
          <chevron-right-icon size="larger"/>
        </wx-button>
      </template>

      <template #content v-if="showStatus.excludeSetting">
        <r-goods-selector
          :select="excludeGoods.select"
          :has-selected="excludeGoods.hasSelected"
          city-name-style="font-size: larger; text-align: center; color: #48b883;"
          selected-style="color: #aeafaf; text-decoration: line-through overline underline;"
        />
      </template>
    </wx-card>

    <wx-card
      title="特别关心"
      :sub-title="showStatus.favoriteSetting ? '会置顶': ''"
      header-margin="0"
      title-size="x-large"
      style="margin-top: 24px;"
    >
      <template #actions>
        <template v-if="showStatus.favoriteSetting">
          <wx-button @click="favoriteGoods.unselectAll">清空</wx-button>
          <wx-button @click="showStatus.favoriteSetting = false">
            <chevron-left-icon size="larger" />
          </wx-button>
        </template>
        <wx-button
          v-else
          @click="showStatus.favoriteSetting = true"
        >
          <chevron-right-icon size="larger" />
        </wx-button>
      </template>
      <template #content v-if="showStatus.favoriteSetting">
        <r-goods-selector
          :select="favoriteGoods.select"
          :has-selected="favoriteGoods.hasSelected"
          city-name-style="font-size: larger; text-align: center; color: #48b883;"
          selected-style="color: white;"
          unselected-style="color: #aeafaf;"
        />
      </template>
    </wx-card>

    <wx-card
      title="恢复默认设置"
      title-size="x-large"
      style="margin-top: 24px;"
      header-margin="0"
    >
      <template #actions>
        <wx-button @click="setToDefault">恢复</wx-button>
      </template>
    </wx-card>
  </div>

  <div>
    <div class="r-goods-table-rating">
      <span>平均利润率: </span>
      <span style="color: white; font-size: larger;">{{goodsList.rating}}</span>
      <span>%</span>
    </div>
    <template v-if="goodsList.favorite.length !== 0">
      <h2>特别关心</h2>
      <r-goods-card
        v-for="goods in goodsList.favorite"
        :key="goods.baseInfo.goodsId"
        :info="goods"
        class="r-goods-card"
      />
    </template>
    <h2 v-if="goodsList.favorite.length !== 0 && goodsList.normal.length !== 0">
      其他
    </h2>
    <r-goods-card
      v-for="goods in (showStatus.moreGoods ? goodsList.normal : goodsList.normal.slice(0, 20))"
      :key="goods.baseInfo.goodsId"
      :info="goods"
      class="r-goods-card"
    />

    <div
      class="r-goods-card-line-btn"
      v-if="!showStatus.moreGoods && goodsList.normal.length > 20"
      @click="showStatus.moreGoods = true"
    >显示全部</div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.r-goods-card {
  margin-top: @app-space;
}

.r-goods-card-line-btn {
  margin-top: 20px;
  border: 1px solid #aeafaf;
  padding: 4px;
  border-radius: 4px;
  text-align: center;
  cursor: pointer;

  &:hover {
    border-color: #48b883;
    color: #48b883;
  }
}

.r-goods-table-setting {
  padding: @app-space;
}

.r-goods-table-setting-sort {
  padding-left: @app-space;
  display: flex;
  flex-wrap: wrap;
}

.r-goods-table-rating {
  margin-top: @app-space;
  span {
    color: #aeafaf;
  }
}
</style>
