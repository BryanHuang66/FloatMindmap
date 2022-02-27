import { excerptNotes, getAllText } from "utils/note"
import {
  reverseEscape,
  string2RegArray,
  string2ReplaceParam
} from "utils/input"
import { HUDController, log, showHUD } from "utils/common"
import { profile } from "profile"

const config: IConfig = {
  name: "悬浮脑图",
  intro: "在文档模式下依然可以浏览节点关系",
  link: "", //todo:手动触发部分插件的使用方法
  settings: [
],
  actions: [
    /*
    编写UI界面（按钮）
    用法：
    {
      type: cellViewType.buttonWithInput,
      label: “按钮名称”,
      key: 控件名称,
      help: “提示”,
      option:["选项a", "选项b"],
    },
  */
  ]
}

const util = {
  /*
  定义控件相关动作
  */
}

const action: IActionMethod = {
  /*
    根据控件名称，调用不同的动作
  */
}





export { config, util, action}
