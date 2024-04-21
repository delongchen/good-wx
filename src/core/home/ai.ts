import {ref} from "vue";
import {sleep} from "@/utils/time.ts";

export interface WxChatMessage {
  position: 'left' | 'right'
  name: string
  message: string
  color: string
  bgColor: string
}

const enum WxStatus {
  Ready,
  Thinking,
}

const wxWords: string[] = [
  '6',
  '嚯，牛逼',
  '我不到啊',
  '?',
  '.',
  '对',
  '还真是',
  '加班',
  '对的嘛',
  '我知道的嘛',
]

const getWxMessage = (question: string): string => {
  if (question.endsWith('?') || question.endsWith('？')) {
    return wxWords[2]
  }
  return wxWords[(Math.random() * wxWords.length) >> 0]
}

export const useWxAI = () => {
  const inputText = ref('')
  const chatMessages = ref<WxChatMessage[]>([])
  const status = ref<WxStatus>(WxStatus.Ready)

  const youSay = (message: string) => {
    chatMessages.value.push({
      message,
      name: '你',
      position: 'right',
      color: 'black',
      bgColor: 'white'
    })
  }

  const wxSay = async (question: string) => {
    await sleep((1000 * (Math.random() * 2 + 1)) >> 0)

    chatMessages.value.push({
      message: getWxMessage(question),
      name: '吴翔',
      position: 'left',
      color: 'white',
      bgColor: '#42b883'
    })
  }

  const scroll = () => {
    const dom = document.getElementById('wxwxwx')
    if (dom === null) return

    dom.scroll({
      top: dom.scrollHeight,
      left: 0,
      behavior: "smooth",
    })
  }

  const handleSubmit = async () => {
    if (status.value !== WxStatus.Ready) {
      return
    }

    const text = inputText.value
    if (text === '') return

    youSay(text)
    status.value = WxStatus.Thinking
    inputText.value = ''

    await wxSay(text)
    scroll()

    status.value = WxStatus.Ready
  }

  return {
    inputText,
    chatMessages,
    handleSubmit,
    status,
  }
}
