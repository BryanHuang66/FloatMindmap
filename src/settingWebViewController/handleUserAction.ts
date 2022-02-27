import { log, showHUD } from "utils/common";
import { delay } from "utils/common";
const webViewDidStartLoad= (webview:any) => {

  log("webViewDidStartLoad","UIwebview")

}
const webViewDidFinishLoad = (webView:any) =>{
  log('webviewDidAppear','UIwebview')
  // var i = 0
  // webView.evaluateJavaScript(`km.importJson({"root": {"data": {"text": "test"},"children": [{"data": {"text": "新闻"}},{"data": {"text": "网页2"} }]},"template":"default"});`)
  // self.webView.evaluateJavaScript(`km.importJson({"root": {"data": {"text": "test"},"children": [{"data": {"text": "新闻"}},{"data": {"text": "网页2"} }]},"template":"default"});`)

  showHUD('success')
  }
  

const webViewDidFailLoadWithError = (webView:any, error:any)=> {
  log(error,'UIwebview')
}

export default {
    webViewDidStartLoad,
    webViewDidFinishLoad,
    webViewDidFailLoadWithError
  }
  
