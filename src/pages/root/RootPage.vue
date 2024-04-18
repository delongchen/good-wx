<script setup lang="ts">
import WxTitle from "@/components/wx/WxTitle.vue";
import WxCard from "@/components/wx/WxCard.vue";
import {ArrowRightIcon} from 'tdesign-icons-vue-next'
import WxButton from "@/components/wx/WxButton.vue";
import {useRouter} from "vue-router";
import {useWxAI} from "@/core/home/ai.ts";
import ChatMessage from "@/pages/root/ChatMessage.vue";

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
      '尽在其中',
    ]
  }
]

const {
  status,
  handleSubmit,
  chatMessages,
  inputText,
} = useWxAI()
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

  <div class="home-wx-ai">
    <div
      class="wx-ai-chat-panel"
      v-if="chatMessages.length !== 0"
      id="wxwxwx"
    >
      <chat-message
        v-for="(msg, index) in chatMessages"
        :key="index"
        :message="msg"
      />
      <div
        v-show="status !== 0"
        class="wx-overcook"
      >
        吴翔过载中
      </div>
    </div>

    <div class="wx-ai-input-panel">
      <div style="flex: 1;">
        <input
          placeholder="有什么想问吴翔的"
          type="text"
          v-model="inputText"
        >
      </div>
      <div>
        <div
          class="wx-ai-submit-btn"
          @click="handleSubmit"
        >提问</div>
      </div>
    </div>
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

.home-wx-ai {
  padding: 10px;
  width: 100%;

  .wx-ai-chat-panel {
    height: 40vh;
    background-color: @app-black-lighter;
    overflow-y: scroll;
    overflow-x: hidden;
    scrollbar-width: none;
    border-radius: 4px;
    padding: 10px 10px 24px 10px;

    .wx-overcook {
      color: #aeafaf;
      font-size: small;
      text-align: center;
    }
  }

  .wx-ai-input-panel {
    margin-top: 10px;
    height: 48px;
    display: flex;

    input {
      border: 0;
      outline-style: none;
      font-size: larger;
      border-radius: 4px;
      height: 100%;
      width: 100%;
      padding-left: 10px;
    }

    .wx-ai-submit-btn {
      height: 100%;
      background-color: #42b883;
      padding: 10px;
      margin-left: 10px;
      border-radius: 4px;
      cursor: pointer;
      font-size: larger;
    }
  }
}
</style>
