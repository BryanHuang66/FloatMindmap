import { eventCtrl } from "jsExtension/handleReceivedEvent"
import { log,showHUD } from "utils/common"
import {delay} from "utils/common"
interface eventHandler {
  (sender: {
    userInfo: {
      [k: string]: any
    }
  }): void
}
const viewDidLoad = () => {
  log('viewWillAppear','UIwebview')
  log("start load view","UIwebview-d")
  log(self.mainPath)
  log(self.tempPath)
  
  var webFrame =   self.view.frame;
  log(self.view.bounds,"selfviewbounds")
  log(self.view.frame,"selfviewframe")
  self.webView = new UIWebView(webFrame);
  // var coverView = new UIView(webFrame);
  // var tap = new UITapGestureRecognizer(self, `onClickOnTableView:`)
  // tap.numberOfTapsRequired = 1
  // tap.numberOfTouchesRequired = 1
  // coverView.addGestureRecognizer(tap)


  // self.coverView.opaque = false
  // coverView.backgroundColor = UIColor.clearColor()


  log(self.webView.alpha,"webView.opaque")
  log(self.view.backgroundColor,"self.view.backgroundColor")
  log(self.webView.backgroundColor,"webView.backgroundColor")
  self.webView.opaque = false
  self.webView.layer.opaque = false
  self.webView.scrollView.opaque = false
  // webView.alpha = 0.5;
  self.webView.backgroundColor = UIColor.clearColor();
  log(self.webView.backgroundColor,"webView.backgroundColor")
  // webView.scalesPageToFit = true;
  self.webView.autoresizingMask = (1 << 1) | (1 << 4);
  self.webView.delegate = self;
  // webView.scrollView.delegate = self;
  self.webView.layer.cornerRadius = 20;

  self.webView.layer.masksToBounds = true;
  self.view.layer.shadowOffset = {
    width: 0,
    height: 0,
  };
  
  self.webView.layer.backgroundColor = UIColor.clearColor()
  self.webView.scrollView.backgroundColor = UIColor.clearColor()
  // webView.scrollView.layer.backgroundColor = UIColor.clearColor()
  self.view.opaque = false
  self.view.alpha = 0.8
  self.view.layer.opaque = false
  self.view.backgroundColor = UIColor.clearColor()
  self.view.layer.cornerRadius = 0;
  self.view.layer.backgroundColor = UIColor.clearColor()
  log(self.view.layer.cornerRadius,"self.view.layer.cornerRadius")
  log(self.view.backgroundColor,"self.backgroundColor")
  
  self.view.addSubview(self.webView)
  
  self.webView.loadFileURLAllowingReadAccessToURL(NSURL.fileURLWithPath(self.mainPath + '/MindMap/index.html'),NSURL.fileURLWithPath(self.mainPath+'/MindMap'));
  
  self.inButton = UIButton.buttonWithType(0);
  self.inButton.frame = { x: webFrame.x + 20, y: webFrame.y + webFrame.height - 50, width: 30, height: 30 };
  self.inButton.autoresizingMask = (1 << 3);
  self.inButton.setTitleForState('+', 0);
  self.inButton.setTitleColorForState(Application.sharedInstance().defaultTintColorForDarkBackground, 0);
  var highlightColor = UIColor.blendedColor(Application.sharedInstance().defaultTintColorForDarkBackground, Application.sharedInstance().defaultTextColor, 0.8);
  self.inButton.setTitleColorForState(highlightColor, 1);
  self.inButton.backgroundColor = Application.sharedInstance().defaultTextColor.colorWithAlphaComponent(0.6);
  self.inButton.layer.cornerRadius = 10;
  self.inButton.layer.masksToBounds = true;
  self.inButton.titleLabel.font = UIFont.systemFontOfSize(14);
  self.inButton.addTargetActionForControlEvents(self, 'zoomIn:',1 <<  6);
  self.view.addSubview(self.inButton);
  // self.updateButton();

  self.outButton = UIButton.buttonWithType(0);
  self.outButton.frame = { x: webFrame.x + 70, y: webFrame.y + webFrame.height - 50, width: 30, height: 30 };
  self.outButton.autoresizingMask = (1 << 3);
  self.outButton.setTitleForState('-', 0);
  self.outButton.setTitleColorForState(Application.sharedInstance().defaultTintColorForDarkBackground, 0);
  var highlightColor = UIColor.blendedColor(Application.sharedInstance().defaultTintColorForDarkBackground, Application.sharedInstance().defaultTextColor, 0.8);
  self.outButton.setTitleColorForState(highlightColor, 1);
  self.outButton.backgroundColor = Application.sharedInstance().defaultTextColor.colorWithAlphaComponent(0.6);
  self.outButton.layer.cornerRadius = 10;
  self.outButton.layer.masksToBounds = true;
  self.outButton.titleLabel.font = UIFont.systemFontOfSize(14);
  self.outButton.addTargetActionForControlEvents(self, 'zoomOut:',1 <<  6);
  self.view.addSubview(self.outButton);


  // self.webView.evaluateJavaScript('document.activeElement.blur();')
  // log("sucess","??????")


  }
  
  // 每次打开都会执行
  const viewWillAppear = (sender:any) => {
    self.webView.delegate = self
  }



  const zoomIn = function(sender:any) {
    self.webView.evaluateJavaScript(`km.execCommand('ZoomIn')`)
      // Application.sharedInstance().showHUD("重新开关插件后生效", self.view.window, 2);
  }

  const zoomOut = function(sender:any) {
    self.webView.evaluateJavaScript(`km.execCommand('ZoomOut')`)
      // Application.sharedInstance().showHUD("重新开关插件后生效", self.view.window, 2);
  }


  export default {
    viewDidLoad,
    viewWillAppear,
    zoomIn,
    zoomOut
  }
  