<script setup lang="ts">
import {useRouter} from "vue-router";
import {ref} from "vue";
import {BookMetaInterface} from "@/types/teller/books";
import {getAllBooks} from "@/store/teller/idb";

const router = useRouter()

const goRead = (uid: number) => {
  router.push({
    name: 'reading',
    query: { uid }
  })
}

const localBookList = ref<BookMetaInterface[]>([])

const updateLocalBookList = () => {
  getAllBooks().then(books => {
    localBookList.value = books
  })
}

updateLocalBookList()
</script>

<template>
  <div
    class="teller-library"
    v-if="localBookList.length !== 0"
  >
    <div
      v-for="book in localBookList"
      class="teller-library-book"
      @click="() => { goRead(book.uid) }"
      :key="book.uid"
    >
      <div class="book-cover">
        <img :src="book.cover" :alt="book.name">
      </div>
      <div class="book-text">
        <div>
          <div style="font-size: large; font-weight: bold;">{{book.name}}</div>
          <div style="font-size: smaller; color: #6d6e6f;">
            {{book.counter.chapter}}章
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else>
    <div class="lib-empty">
      <div>空空如也</div>
      <div>快去书城看看吧</div>
    </div>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.teller-library {
  padding: 10px;
  display: flex;
  flex-direction: column;
}

.teller-library-book {
  display: flex;
  padding: 10px;
}

.book-cover {
  width: 15vw;
  margin-right: 10px;

  img {
    width: 100%;
    height: 100%;
    border-radius: 4px;
  }
}

.book-text {
  flex: 1;
  display: flex;
  align-items: center;
}

.lib-empty {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  display: flex;
  flex-direction: column;
  align-items: center;
}
</style>
