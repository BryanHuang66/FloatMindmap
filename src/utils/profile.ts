import { dataSource, dataSourceIndex } from "synthesizer"
import { log, showHUD } from "utils/common"
import { profile, docProfile, IProfile, IProfile_doc } from "profile"

// 读配置包含两种情况
// 1.刚打开 MN 然后打开笔记本，读两个配置文件，然后合并
// 2.切换文档，只需要读取 doc 配置

let allDocProfile: { [k: string]: IProfile_doc } = {}
const profileKey = "marginnote_autodetect_profile_global_200"
const docProfileKey = "marginnote_autodetect_profile_doc_200"

const getDataByKey = (key: string) =>
  NSUserDefaults.standardUserDefaults().objectForKey(key)
const setDataByKey = (data: string, key: string) =>
  void NSUserDefaults.standardUserDefaults().setObjectForKey(data, key)

export const updateDataSource = (profile: IProfile_doc | IProfile) => {
  for (const [name, _] of Object.entries(profile)) {
    for (const [key, val] of Object.entries(_)) {
      const [section, row] = dataSourceIndex?.[name]?.[key] ?? [0, 0]
      switch (typeof val) {
        case "boolean":
          // @ts-ignore
          dataSource[section].rows[row].status = val
          break
        case "string":
          // @ts-ignore
          dataSource[section].rows[row].content = val
          break
        default:
          // @ts-ignore
          dataSource[section].rows[row].selections = val
      }
    }
  }
}

const mergeObject = (obj: any, src: any) => {
  Object.keys(src).forEach(key => {
    Object.assign(obj[key], src[key])
  })
}

const readProfile = (docmd5: string, readAll = false) => {
  // 读取全局配置
  if (readAll) {
    const string_profile = getDataByKey(profileKey)
    if (string_profile) mergeObject(profile, JSON.parse(string_profile))
    updateDataSource(profile)
    log("读取全局配置", "profile")
    log(profile.autodetect, "profile")
  }

  // 重置默认文档配置，预防后期增加新的文档配置项
  mergeObject(profile, docProfile)
  updateDataSource(docProfile)

  // 读取文档配置
  const string_doc_profile = getDataByKey(docProfileKey)
  if (string_doc_profile) {
    const json_doc_profile = JSON.parse(string_doc_profile)[docmd5]
    if (json_doc_profile) {
      mergeObject(profile, json_doc_profile)
      allDocProfile = JSON.parse(string_doc_profile)
      updateDataSource(json_doc_profile)
      log("检测到文档配置，正在读取", "profile")
      

      // if(profile.autodetect.visible)
      // {
      //   log("begin","excerpt")
      //   NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'onPopupMenuOnNote:','PopupMenuOnNote');
      //   NSNotificationCenter.defaultCenter().addObserverSelectorName(self,'onPopupMenuOnSelection:','PopupMenuOnSelection');
      //   NSTimer.scheduledTimerWithTimeInterval(0.2,false,function(){
      //   var deepl_on = NSUserDefaults.standardUserDefaults().objectForKey('marginnote_float_mindmap');
      //   if(Application.sharedInstance().studyController(self.window).studyMode < 3){
      //     log("popup","UIWebview")// Not support in card deck mode
      //     Application.sharedInstance().studyController(self.window).view.addSubview(self.webController.view);

      //     var frame = Application.sharedInstance().studyController(self.window).view.bounds;
      //     var width = frame.width > 300?(900 + (frame.width - 300)/2):900;
      //     log(width,"width")
      //     self.webController.view.frame = {x:(frame.width-width)/2,y:frame.height - 300,width:width,height:280};

      //     Application.sharedInstance().studyController(self.window).refreshAddonCommands();
      //     NSTimer.scheduledTimerWithTimeInterval(0.2,false,function(){ 
      //       Application.sharedInstance().studyController(self.window).becomeFirstResponder(); //For dismiss keyboard on iOS
      //     });
      //   }
      //   })
      // }
    }
  }
}

// 切换的时候仅保存当前文档的，退出的时候全部保存
const saveProfile = (docmd5: string, saveAll = false) => {
  // 深复制，防止修改 docProfile
  const thisDocProfile: IProfile_doc = JSON.parse(JSON.stringify(docProfile))
  Object.entries(thisDocProfile).forEach(([name, _]) => {
    Object.keys(_).forEach(key => {
      //@ts-ignore
      thisDocProfile[name][key] = profile[name][key]
    })
  })
  allDocProfile[docmd5] = thisDocProfile
  setDataByKey(JSON.stringify(allDocProfile), docProfileKey)
  log("保存文档配置", "profile")
  if (saveAll) {
    log("保存全部配置", "profile")
    log(profile.autodetect, "profile")
    setDataByKey(JSON.stringify(profile), profileKey)
  }
}

const removeProfile = () => {
  NSUserDefaults.standardUserDefaults().removeObjectForKey(profileKey)
  NSUserDefaults.standardUserDefaults().removeObjectForKey(docProfileKey)
}

export { saveProfile, readProfile, removeProfile }
