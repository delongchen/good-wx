<script setup lang="ts">
import WxTitle from "@/components/wx/WxTitle.vue";
import WxCard from "@/components/wx/WxCard.vue";
import {ArrowRightIcon} from 'tdesign-icons-vue-next'
import WxButton from "@/components/wx/WxButton.vue";
import {useRouter} from "vue-router";

const router = useRouter()
const out = (path: string) => {
  if (path === '') return

  router.push({path})
    .finally(() => {
      scroll({
        top: 0,
        left: 0,
      })
    })
}

interface HomeCardType {
  title: string,
  sub: string,
  desc: string[],
  path: string,
}

const cards: HomeCardType[] = [
  {
    title: '祈福',
    sub: '敲木鱼',
    path: '/muyu',
    desc: [
      '吴翔是我们的好兄弟',
      '亦是肥子肥父肥灵三肥一体',
      '没事就来敲一敲木鱼吧',
      '啊! 翔门!'
    ]
  },
  {
    title: '开火车',
    sub: '雷索纳斯 resonance',
    path: '/resonance',
    desc: [
      '开电子火车',
      '当赛博倒爷',
      '来一起当列车长帕!'
    ]
  },
  {
    title: 'wx小说',
    sub: '深黑幻想',
    path: '/teller',
    desc: [
      '陨落的天才',
      '外门弟子唐三',
      '尽在其中'
    ]
  }
]
</script>

<template>
  <div class="home-top-space"/>
  <div class="home-hello">
    <wx-title
      static
      text="wu#xiang#smart#boy"
      upper-size="xxx-large"
      end-with="_"
    />
    <div style="font-size: xxx-large">
      综合性吴翔社区
    </div>
    <p style="color: #8f8f8f">其实没有吴翔(</p>
  </div>
  <div class="home-card-list">
    <wx-card
      class="home-card-item"
      v-for="(card, key) in cards"
      :key="key"
      :title="card.title"
      :sub-title="card.sub"
    >
      <template #actions>
        <div>
          <wx-button style="padding: 0;" @click="() => { out(card.path) }">
            <arrow-right-icon size="x-large"/>
          </wx-button>
        </div>
      </template>
      <template #content>
        <p
          v-for="(line, n) in card.desc"
          :key="n"
        >{{line}}</p>
      </template>
    </wx-card>
  </div>
</template>

<style scoped lang="less">
@import "@/style/preset";

.home-top-space {
  height: 20vh;
  @media @max960 {
    display: none;
  }
}

.home-card-list {
  display: flex;
  margin-top: @app-space * 2;

  .home-card-item {
    flex: 1;
    margin-right: @app-space;

    &:last-child {
      margin-right: 0;
    }
  }

  @media @max960 {
    flex-direction: column;

    .home-card-item {
      margin-right: 0;
      margin-top: @app-space;
    }
  }
}

</style>
