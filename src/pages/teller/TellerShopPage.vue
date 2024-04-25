<script setup lang="ts">
import WxCard from "@/components/wx/WxCard.vue";
import {useRouter} from "vue-router";
import {fmtCharNum} from './utils'
import {BookMetaInterface} from "@/types/teller/books";
import {ref} from "vue";
import {fetchBookMetaList} from "@/api/books.ts";
import {selectedMeta} from "@/store/teller/shop";

const metaCollectionMap = ref<Map<string, BookMetaInterface[]>>(new Map)

const router = useRouter()

const goDetail = (meta: BookMetaInterface) => {
  selectedMeta.value = meta
  router.push({
    name: 'book-detail',
    query: {
      uid: meta.uid
    }
  })
}

const updateMetaList = async () => {
  const metaListRaw = await fetchBookMetaList()
  metaListRaw.forEach(it => {
    const collection = metaCollectionMap.value.get(it.collection)
    if (collection === undefined) {
      metaCollectionMap.value.set(
        it.collection,
        [it],
      )
    } else {
      collection.push(it)
    }
  })
}

updateMetaList()
</script>

<template>
  <div
    class="teller-shop"
    v-if="metaCollectionMap.size !== 0"
  >
    <wx-card
      v-for="(collection, index) in [...metaCollectionMap.entries()]"
      :key="`collection-${index}`"
      :title="collection[0]"
      title-size="large"
      header-margin="0 0 10px 0"
      :style="{
        backgroundColor: 'white',
        marginBottom: '10px'
      }"
    >
      <template #content>
        <div class="teller-shop-content">
          <div
            v-for="item in collection[1]"
            class="teller-book-card"
            :key="item.uid"
            @click="() => { goDetail(item) }"
          >
            <div class="teller-book-card-cover">
              <img :src="item.cover" :alt="item.name">
            </div>
            <div class="teller-book-card-text">
              <div class="teller-book-card-title">
                {{item.name}}
              </div>
              <div class="teller-book-card-desc">
                {{
                  item.summary.length === 0 ?
                    '暂无简介'
                    :
                    `${item.summary.slice(0, 40)}...`
                }}
              </div>
              <div class="teller-book-card-info">
                {{fmtCharNum(item.counter.char)}}字
              </div>
            </div>
          </div>
        </div>
      </template>
    </wx-card>
  </div>

  <div
    v-else
    class="teller-shop-loading"
  >
    <div>少女加载中...</div>
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

.teller-shop-loading {
  height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  font-size: x-large;
}
</style>
