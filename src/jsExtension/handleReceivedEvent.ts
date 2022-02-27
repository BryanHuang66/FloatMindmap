//处理各项输入
import handleExcerpt from "jsExtension/excerptHandler"
import { closePanel, layoutViewController } from "jsExtension/switchPanel"
import { profile } from "profile"
import { delay } from "utils/common"
import { openUrl } from "utils/common"
import { actions } from "synthesizer"
import {
  delayBreak,
  HUDController,
  isThisWindow,
  log,
  popup,
  showHUD
} from "utils/common"
import eventHandlerController from "utils/event"
import {
  getNoteById,
  getSelectNodes,
  getSelectNodesAll,
  undoGroupingWithRefresh
} from "utils/note"

export const eventCtrl = eventHandlerController([
  { event: "InputOver" },
  { event: "ButtonClick" },
  { event: "SelectChange" },
  { event: "SwitchChange" },
  { event: "PopupMenuOnNote" },
  { event: "ProcessNewExcerpt" },
  { event: "ChangeExcerptRange" }
])

interface eventHandler {
  (sender: {
    userInfo: {
      [k: string]: any
    }
  }): void
}

let customSelectedNodes: MbBookNote[] = []
const onButtonClick: eventHandler = async sender => {
  if (!isThisWindow(sender, self.window)) return
  let { key, option, content } = sender.userInfo
  // if (key != "filterCards" && profile.ohmymn.clickHidden) closePanel()

  let nodes: MbBookNote[] = []
  if (customSelectedNodes.length) {
    nodes = customSelectedNodes
    customSelectedNodes = []
    HUDController.hidden()
  } else {
    nodes = getSelectNodes()
    if (!nodes.length) {
      showHUD("未选中任何脑图卡片")
      return
    }
    const isHavingChildren = nodes.every(
      node => nodes[0].parentNote == node.parentNote && node?.childNotes.length
    )
    if (isHavingChildren) {
      const { option } = await popup(
        "OhMyMN",
        nodes.length > 1
          ? "检测到您选中的同层级卡片均有子节点"
          : "检测到您选中的唯一卡片有子节点",
        UIAlertViewStyle.Default,
        ["仅处理选中的卡片", "仅处理所有子节点", "处理选中的卡片及其子节点"],
        (alert: UIAlertView, buttonIndex: number) => ({
          option: buttonIndex
        })
      )
      nodes = [nodes, getSelectNodesAll(true), getSelectNodesAll()][option!]
    }
  }
  switch (key) {
    case "filterCards":
      customSelectedNodes = actions[key]({
        content,
        nodes,
        option
      })
      break
    // 异步函数，不要包裹在 undoGrouping 里面
    case "completeSelected":
      actions[key]({
        content,
        nodes,
        option
      })
      break
    default:
      undoGroupingWithRefresh(() => {
        actions[key]({
          content,
          nodes,
          option
        })
      })
  }
}

const onSwitchChange: eventHandler = sender => {
  // log(sender, "onswitchchange")
  // log(self.window,"onswitchchange")
  if (!isThisWindow(sender, self.window)) return
  log(sender.userInfo, "onswitchchange")
  const { name, key, status } = sender.userInfo
  log(name,"onswitchchange")
  try{profile[name][key] = status}catch(e){log(e,"onswitchchange")}
  log("switch","switch")
  log(profile,"switch")

  switch (key) {
    case "lockExcerpt":
      if (status && profile.ohmymn.autoCorrect)
        showHUD("锁定摘录不建议和自动矫正同时开启", 2)
      break
    case "autoCorrect":
      if (status) showHUD("请按实际情况选择开关，不建议无脑打开自动矫正", 2)
      break

    case "visible":
      if (status) {
        // openUrl("marginnote3app://note/3C952DA7-443A-4237-8D9E-EB60BCEA8EAD")
        var a = ["lt","rt","ct","rb","lb"]
        log(a[profile.autodetect.position[0]],"popupmenu")
        self.webController.position = a[profile.autodetect.position[0]]
        delay(0.2).then(() => void self.studyController.becomeFirstResponder())
        try{
          viewPopUp()
          var theme_list = ["fresh-blue","fresh-blue-compat","fresh-green","fresh-red","fresh-pink","fresh-pink-compat","fresh-purple","fresh-purple-compat","fresh-red","fresh-red-compat","fresh-soil","fresh-soil-compat","wire"]
          // log(theme_list[profile.autodetect.theme[0]],"!!!!!!!!!")
          self.webController.webView.evaluateJavaScript(`km.execCommand("theme", "${theme_list[profile.autodetect.theme[0]]}")`) 
       
          log("success","popupmenu")
        }catch(e){
          log(e,"popupmenu")
        }
      }
      else{
        self.webController.view.removeFromSuperview();
        NSNotificationCenter.defaultCenter().removeObserverName(self, 'PopupMenuOnSelection');
        NSNotificationCenter.defaultCenter().removeObserverName(self, 'ClosePopupMenuOnSelection');
      }
      break
    default:
      break
  }
}

const onSelectChange: eventHandler = sender => {
  if (!isThisWindow(sender, self.window)) return
  const { name, key, selections } = sender.userInfo
  profile[name][key] = selections
  log(selections)
  switch (key) {
    case "panelPostion":
    case "panelHeight":
      layoutViewController()
      break
    case "position":
      var a = ["lt","rt","ct","rb","lb"]
      self.webController.position = a[selections[0]]
      log("changepoisition","changepoisition")
      if(profile.autodetect.visible){
        viewPopUp()
      }
    case "theme":
      var theme_list = ["fresh-blue","fresh-blue-compat","fresh-green","fresh-red","fresh-pink","fresh-pink-compat","fresh-purple","fresh-purple-compat","fresh-red","fresh-red-compat","fresh-soil","fresh-soil-compat","wire"]
      log(theme_list[selections[0]],"theme")
      self.webController.webView.evaluateJavaScript(`km.execCommand("theme", "${theme_list[selections[0]]}")`)
    
      break
    
  }
}

const onInputOver: eventHandler = sender => {
  if (!isThisWindow(sender, self.window)) return
  // showHUD("进行1") 
  const { name, key, content } = sender.userInfo
  profile[name][key] = content
  // showHUD("进行2") 
  content ? showHUD("输入已保存") : showHUD("输入已清空")
}

// 不管是创建摘录还是修改摘录，都会提前触发这个事件，所以要判断一下，在修改之前保存上次摘录
let isProcessNewExcerpt = false
let isChangeExcerptRange = false
let  lastExcerptText = "😎"
const onPopupMenuOnNote: eventHandler = async sender => {
  log("选择摘录","excerpt")
  if (!isThisWindow(sender, self.window)) return
  const note = <MbBookNote>sender.userInfo.note
  isChangeExcerptRange = false
  isProcessNewExcerpt = false
  const success = await delayBreak(
    10,
    0.05,
    () => isChangeExcerptRange || isProcessNewExcerpt
  )
  if (success) return
  // 保存修改摘录前的内容
  // 这里有可能转为了标题，所以摘录为空
  lastExcerptText = "😭"
  handleExcerpt(note,lastExcerptText)
}

const onChangeExcerptRange: eventHandler = sender => {
  log("修改摘录", "excerpt")
  if (!isThisWindow(sender, self.window)) return
  log("修改摘录", "excerpt")
  lastExcerptText = ""
  const note = getNoteById(sender.userInfo.noteid)
  isChangeExcerptRange = true
  log(lastExcerptText,"excerpt--")
  handleExcerpt(note, lastExcerptText)
}

const onProcessNewExcerpt: eventHandler = sender => {
  if (!isThisWindow(sender, self.window)) return
  log("创建摘录", "excerpt")
  const note = getNoteById(sender.userInfo.noteid)
  isProcessNewExcerpt = true
  // 摘录前初始化，使得创建摘录时可以自由修改  
  lastExcerptText = "😎"
  handleExcerpt(note, lastExcerptText) 
    // showHUD(lastExcerptText)
}
const viewPopUp = function(){
  log("begin","excerpt") 
        NSTimer.scheduledTimerWithTimeInterval(0.2,false,function(){
        if(Application.sharedInstance().studyController(self.window).studyMode < 3){
          // showHUD("pop")
          log("popup","UIWebview")// Not support in card deck mode
          self.studyController.view.addSubview(self.webController.view)
          // var tap = new UITapGestureRecognizer(self, `onClickOnTableView:`)
          // tap.delegate = self.webController
          // tap.numberOfTapsRequired = 1
          // tap.numberOfTouchesRequired = 1
          // log(self,"vvvvvvv")
          // log(tap,"tap")
          // self.view.addGestureRecognizer(tap)
          self.layoutViewController();
          // showHUD("popup")
          self.studyController.refreshAddonCommands();
          NSTimer.scheduledTimerWithTimeInterval(0.2,false,function(){ 
          self.studyController.becomeFirstResponder();
          log("finishpopup","UIWebview") //For dismiss keyboard on iOS
          });
        }
        }); 
}


export default {
  onInputOver,
  onButtonClick,
  onSelectChange,
  onSwitchChange,
  onPopupMenuOnNote,
  onProcessNewExcerpt,
  onChangeExcerptRange,
}

export{
  viewPopUp
}