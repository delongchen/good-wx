import {MessageType} from "../../type";

const zh_CN: MessageType = {
  lang: '简体中文',
  router: {
    muyu: '祈福',
    resonance: '开火车',
    about: '关于',
  },
  layout: {
    app: {
      header: {
        title: '吴翔祈福',
        actions: {
          lang: '语言'
        }
      }
    }
  },
  main: {
    wx: {
      desc: {
        line1: '吴翔是我们的好兄弟',
        line2: '亦是肥子肥父肥灵三肥一体',
        line3: '请敲打下面这个可爱的木鱼为他祈福',
        line4: '啊！翔门'
      },
      count: '全球祈福次数'
    }
  },
  footer: {
    pr: '贡献更多语言或者使网页更好'
  }
}

export default zh_CN
