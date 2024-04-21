<script setup lang="ts">
import {WxChatMessage} from "@/core/home/ai";
import WxLogo from '@/assets/wx-logo.jpg'
import CdlLogo from '@/assets/cdl-logo.jpg'

const props = defineProps<{
  message: WxChatMessage
}>()
</script>

<template>
  <div
    class="wx-chat-message-panel"
    :style="{
      flexDirection: props.message.position === 'left' ? 'row' : 'row-reverse'
    }"
  >
    <div
      class="message-name"
    >
      <img
        :src="props.message.position === 'left' ? WxLogo : CdlLogo"
        alt="wx"
        style="width: 36px; border-radius: 18px;"
      >
    </div>

    <div>
      <div
        :style="{
          fontSize: 'small',
          display: 'flex',
          flexDirection: props.message.position === 'left' ? 'row' : 'row-reverse',
          padding: '0 10px 0 10px'
        }"
      >{{props.message.name}}</div>
      <div
        class="message-text"
        :style="{
        backgroundColor: props.message.bgColor,
        color: props.message.color,
      }"
      >
        {{props.message.message}}
      </div>
    </div>
  </div>
</template>

<style scoped lang="less">
.wx-chat-message-panel {
  display: flex;
  margin-bottom: 10px;
  flex-direction: row-reverse;

  .message-text {
    padding: 10px;
    border-radius: 4px;
    margin-left: 10px;
    margin-right: 10px;
    max-width: 50vw;
    overflow-wrap: anywhere;
  }
}
</style>
