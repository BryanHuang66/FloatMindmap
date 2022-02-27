import { profile } from "profile"
import { isOCNull, log, showHUD } from "utils/common"
import {fetch,post} from "utils/network"
import { reverseEscape } from "utils/input"
/*
   UI界面样式
*/
const config: IConfig = {
  name: "autodetect",
  intro: '悬浮脑图，给你更大的阅读空间',
  link: "",  //Todo：Replacing link
  settings: [ 
    /*
    设置模块样式
    用法：
    {
      key:"控件名称",
      type: cellViewType.*****,
      label:"显示的名称"
    }
    支持控件：
      - switch
      - inlineInput
      - input
      - plainText
      - select
      - multiSelect
    */
   {
      key: "visible",
      type: cellViewType.switch,
      label: "是否显示"
   },
   {
     key:"position",
     type:cellViewType.select,
     label:"位置",
     option:["左上","右上","中","右下","左下"]
   },
   {
     key:"theme",
      type:cellViewType.select,
      label:"主题",
      option:["蓝色","紧凑蓝色","绿色","紧凑绿色","粉色","紧凑粉色","紫色","紧凑紫色","红色","紧凑红色","棕色","紧凑棕色","线条"]
   }
  ],
  actions: [
    /*
    不需要填写
    */
  ]
}

/*
  初始值

*/


const util = {
  
  /*
  定义控件相关动作
  */
 pick_out_info(_note:any){
  let dic : {[key:string]:any} = {};
  if(_note.excerptPic){
    const actualArea = util.getExcerptArea(_note)

    var pic_input = _note.excerptPic
    var pic_size =pic_input.size
    log(actualArea,"actualArea")
    // var pic_size_value = pic_size.values()
    // log(typeof pic_size_value,"pic_size_value")
    // log(pic_size_value.next().value,"pic_size_value.next().value")
    // log(pic_size,"pic_size")
    log("begin","begin")
    log(pic_size["values"],"pic_size")
    var hash = pic_input.paint
    var pic_info = Database.sharedInstance().getMediaByHash(hash).base64Encoding()
    dic["data"]={"image":"data:image/png;base64,"+pic_info,"imageSize": { "width": actualArea.width, "height": actualArea.height} }
    log(pic_info,"pic_info")
    return dic
  }else{
    var pic_text = _note.excerptText
    if(pic_text){
    dic["data"] = {"text":pic_text}
    }else{
      var pic_title = _note.noteTitle
      dic["data"] = {"text":pic_title}
    }
    return dic
  } 
 },
 
 getExcerptArea(note: MbBookNote) {
    const [x1, y1, x2, y2] = (
      reverseEscape(`[${note.startPos},${note.endPos}]`) as number[]
    ).map(item => Number(item))
    const width = Math.abs(x1-x2)
    const height = Math.abs(y1-y2)
    const output = {"width":width,"height":height}
    return output
  },
}

const action: IActionMethod = {
  /*
    不需要填写
  */
}

function excerptHandler(_note:MbBookNote,_lastExcerptText?:string){
  if(profile.autodetect.visible){
    if(_lastExcerptText == "😭" || _lastExcerptText == "😎") {
      log(_note,"excerpt_text")
      log(_note.excerptText,"excerpt_text")
      log(_note.excerptPic,"excerpt_pic")
      log(_note.noteTitle,"excerpt_title")
      // var pic_input = _note.excerptPic
      // var hash = (pic_input?.paint) ? pic_input.paint : ""
      // try{var pic_info = Database.sharedInstance().getMediaByHash(hash)?.base64Encoding()}catch(error){showHUD('没有找到对应图片')}
      // log(pic_info,"pic_info")
      // log(_note.noteId,"note_id")
      // log(_note.parentNote,"parent_note")
      // log(_note.childNotes,"child_notes")
      // log(_note.linkedNotes,"linked_notes")
      // log(_note.comments,"comments")
      var noteInfo = util.pick_out_info(_note)
      
      var parent_node = _note.parentNote
      var child_notes = _note.childNotes
      var linked_notes = _note.linkedNotes
      var child_notes_list = []
      var linked_notes_list = []
  

      if(child_notes){
        for(var item in child_notes){
          log(child_notes[item])
        child_notes_list.push(util.pick_out_info(child_notes[item]))
        if(child_notes_list){
          noteInfo["children"] = child_notes_list
          log(noteInfo,"note_info1")
        }
      }

      // for(var item in linked_notes){
      //   linked_notes_list.push(util.pick_out_info(linked_notes[item]))
      // }
      
      if(parent_node){
        var parent_note_info = util.pick_out_info(parent_node)
        var note_info_list = [noteInfo]
        parent_note_info["children"] = note_info_list
        var output1 = {"root":parent_note_info}
        log(JSON.stringify(output1),"output")
        self.webController.webView.evaluateJavaScript('km.importJson('+JSON.stringify(output1)+')')
        var theme_list = ["fresh-blue","fresh-blue-compat","fresh-green","fresh-green-compat","fresh-pink","fresh-pink-compat","fresh-purple","fresh-purple-compat","fresh-red","fresh-red-compat","fresh-soil","fresh-soil-compat","wire"]
        self.webController.webView.evaluateJavaScript(`km.execCommand("theme", "${theme_list[profile.autodetect.theme[0]]}")`)
      } 
      else{
        var output2 = {"root":noteInfo}
        log(JSON.stringify(output2),"output2")
        self.webController.webView. evaluateJavaScript('km.importJson('+JSON.stringify(output2)+')')
        var theme_list = ["fresh-blue","fresh-blue-compat","fresh-green","fresh-green-compat","fresh-pink","fresh-pink-compat","fresh-purple","fresh-purple-compat","fresh-red","fresh-red-compat","fresh-soil","fresh-soil-compat","wire"]
        self.webController.webView.evaluateJavaScript(`km.execCommand("theme", "${theme_list[profile.autodetect.theme[0]]}")`)
      }
    
    }
    }
  }
} 


export { config,action,excerptHandler,util}