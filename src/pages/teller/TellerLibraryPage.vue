<script setup lang="ts">
import {getLibList} from "@/store/teller/books.ts";
import {computed} from "vue";
import {getCoverUrl} from "@/api/teller.ts";
import {useRouter} from "vue-router";
import {BookDetail} from "@/types/teller/books.ts";

const router = useRouter()

const goReading = (book: BookDetail) => {
  router.push({
    name: 'reading',
    query: { uid: book.index.uid }
  })
}

const bookList = computed(getLibList)
</script>

<template>
  <div
    class="teller-library"
    v-if="bookList.length !== 0"
  >
    <div
      v-for="book in bookList"
      @click="() => { goReading(book) }"
      class="teller-library-book"
      :key="book.index.uid"
    >
      <div class="book-cover">
        <img :src="getCoverUrl(book.index)" :alt="book.index.name">
      </div>
      <div class="book-text">
        <div>
          <div style="font-size: large; font-weight: bold;">{{book.index.name}}</div>
          <div style="font-size: smaller; color: #6d6e6f;">
            <span v-if="book.history !== 0">{{book.history}}章/</span>
            {{book.chapters.length}}章
          </div>
        </div>
      </div>
    </div>
  </div>
  <div v-else></div>
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
</style>
