<script setup lang="ts">
import WxMonaco from "@/components/monaco/WxMonaco.vue";
import {ref} from "vue";
import {debounce} from "@/utils/fn.ts";
import * as TellerRuleLang from '@/core/monaco/lang/teller-rule'

const source = ref('')
const output = ref<any>()

const handleSourceChange = debounce((value: string) => {
  source.value = value
}, 250)

const compileSource = () => {
  output.value = {foo: 'bar'}
}

const loadCode = () => {
  source.value = '萧[炎, 薰儿, 潇, 霖, 晨, 战, 鼎, 厉, 林, 宁, 媚, 玉, 族, 盟]: 吴{$self[1:]};\n' +
    '萧炎: 吴翔;\n' +
    '炎儿: 翔子;\n' +
    '萧薰儿: 吴梓熙;\n' +
    '薰儿: 梓熙;\n' +
    '药[尘, 星极, 万归, 老, 族, 帮]: 郭{$self[1:]};\n' +
    '[彩鳞, 美杜莎]: 张主管;\n' +
    '小医仙: 小仙女;\n' +
    '纳兰[嫣然, 桀]: 毛[gay];\n' +
    '嫣然: 玉桤;\n' +
    '云[韵, 山, 帆];\n' +
    '青[鳞, 海];\n' +
    '紫妍;\n' +
    '米特尔: 比亚迪;\n' +
    '雅妃: 华为;\n' +
    '海波东: 扎克脖割;\n' +
    '古[河, 灵, 妖, 青阳, 元];\n' +
    '林[修崖, 焱];\n' +
    '琥[嘉, 乾];\n' +
    '韩[月, 枫, 闲, 池, 雪, 田, 冲];\n' +
    '苏[千, 笑, 媚];\n' +
    '慕[青鸾, 骨, 桑];\n' +
    '[剑, 黄泉, 雷, 铁剑]尊者;\n' +
    '唐[震, 火儿];\n' +
    '曹[休, 颖, 单];\n' +
    '黑、白天尊;\n' +
    '[黑, 白]天尊;\n' +
    '[火云, 丹塔]老祖;\n' +
    '穆力: 勃起;\n' +
    '罗[布, 侯, 成];\n' +
    '蒙[喇, 力];\n' +
    '[圣耀, 黑魔, 万兽, 山熔]鼎;\n' +
    '\n' +
    '异火: 异屌;\n' +
    '[\n' +
    '    帝,\n' +
    '    虚无吞,\n' +
    '    金帝焚天,\n' +
    '    九幽风,\n' +
    '    火云水,\n' +
    '    陨落心,\n' +
    '    风怒龙,\n' +
    '    阴阳双,\n' +
    '    玄黄,\n' +
    ']炎: {$self[:-1]}屌;\n' +
    '\n' +
    '[\n' +
    '    净莲妖,\n' +
    '    九幽金祖,\n' +
    '    九龙雷罡,\n' +
    '    三千焱炎,\n' +
    '    红莲业,\n' +
    '    骨灵冷,\n' +
    '    龟灵地,\n' +
    '    青莲地心,\n' +
    '    幽冥毒,\n' +
    '    万兽灵,\n' +
    ']火: {$self[:-1]}屌;\n' +
    '\n' +
    '[生灵之, 八荒破灭]焱: {$self[:-1]}屌;\n' +
    '\n' +
    '[海心, 火山石]焰: {$self[:-1]}屌;\n' +
    '\n' +
    '斗[气, 之气, 者, 师, 灵, 王, 皇, 宗, 尊, 圣, 帝]: 翔{$self[1:]};\n' +
    '\n' +
    '[一, 二, 三, 四, 五, 六, 七, 八, 九, 帝]品丹药: {$self[0:1]}壮阳药;\n' +
    '丹药: 壮阳药;\n' +
    '\n' +
    '炎盟;\n' +
    '天府联盟;\n' +
    '蛇人族部落;\n' +
    '黑角域;\n' +
    '迦南学院;\n' +
    '磐门;\n' +
    '白帮;\n' +
    '月灵;\n' +
    '狼牙;\n' +
    '烈山;\n' +
    '魂殿;\n' +
    '丹塔;\n' +
    '\n' +
    '[加玛, 出云, 落雁, 慕兰, 天蛇]帝国: \n' +
    '[];\n' +
    '\n' +
    '[花, 云岚, 天冥, 毒, 金雁]宗: \n' +
    '[];\n' +
    '\n' +
    '[焚炎, 冰河, 慕兰]谷: \n' +
    '[];\n' +
    '\n' +
    '[星陨, 风雷, 万剑, 黄泉]阁: \n' +
    '[];\n' +
    '\n' +
    '[萧, 魂, 炎, 古, 雷, 石, 灵, 太虚古龙, 九幽地冥蟒, 天妖凰]族: \n' +
    '[];'
}

</script>

<template>
  <div class="rule-compiler-page">
    <div class="rule-editor-panel">
      <wx-monaco
        style="flex: 1;"
        :value="source"
        :language="TellerRuleLang.id"
        :theme="TellerRuleLang.themeName"
        @change="handleSourceChange"
      />
      <div
        class="rule-result"
        style="flex: 1;"
      >{{output}}</div>
    </div>

    <div
      class="editor-tool-bar"
    >
      <div
        @click="loadCode"
        class="editor-tool-item"
      >load</div>
      <div
        @click="compileSource"
        class="editor-tool-item"
      >compile</div>
    </div>
  </div>
</template>

<style scoped lang="less">
.rule-editor-panel {
  height: 90vh;
  background-color: black;
  display: flex;
}

.rule-editor-container {
  flex: 1;
}

.rule-result {
  padding: 10px;
}

.editor-tool-bar {
  height: 10vh;
  background-color: #6d6e6f;
  display: flex;
  padding: 10px;
}

.editor-tool-item {
  cursor: pointer;
  padding: 10px;
  margin: 10px;
  background-color: #48b883;
  border-radius: 4px;
}
</style>
