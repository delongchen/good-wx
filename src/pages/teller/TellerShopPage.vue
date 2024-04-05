<script setup lang="ts">
import WxCard from "@/components/wx/WxCard.vue";
import {useRouter} from "vue-router";
import {fmtCharNum} from './utils'
import {getCoverUrl} from '@/api/teller'
import {refreshBookIndexList, bookIndexListRef} from '@/store/teller/books'

const router = useRouter()

refreshBookIndexList()
</script>

<template>
  <div
    class="teller-shop"
  >
    <wx-card
      title="今日必读"
      title-size="large"
      header-margin="0 0 10px 0"
      :style="{
        backgroundColor: 'white'
      }"
    >
      <template #content>
        <div class="teller-shop-content">
          <div
            v-for="item in bookIndexListRef"
            class="teller-book-card"
            :key="item.uid"
            @click="() => { router.push({name: 'book-detail', query: {uid: item.uid}}) }"
          >
            <div class="teller-book-card-cover">
              <img :src="getCoverUrl(item)" alt="cover">
            </div>
            <div class="teller-book-card-text">
              <div class="teller-book-card-title">
                {{item.name}}
              </div>
              <div class="teller-book-card-desc">
                {{
                  item.info.sum.length === 0 ?
                    '暂无简介'
                    :
                    `${item.info.sum.slice(0, 40)}...`
                }}
              </div>
              <div class="teller-book-card-info">
                {{fmtCharNum(item.info.counter.char)}}字
              </div>
            </div>
          </div>
        </div>
      </template>
    </wx-card>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.teller-shop {
  padding: @app-space;

  @media @max960 {
    padding: 10px;
  }
}

.teller-shop-content {
  display: flex;
  flex-direction: column;
}

.teller-book-card {
  display: flex;
  margin-top: 20px;

  .teller-book-card-cover {
    flex-shrink: 0;
    width: 20vw;
    height: 12vh;
    margin-right: 10px;

    img {
      border-radius: 4px;
      width: 100%;
      height: 100%;
    }
  }

  .teller-book-card-text {
    display: flex;
    flex-direction: column;
    justify-content: space-between;

    .teller-book-card-title {
      font-size: larger;
      font-weight: bold;
    }

    .teller-book-card-info,
    .teller-book-card-desc {
      font-size: small;
      color: #6d6e6f;
    }
  }
}
</style>
