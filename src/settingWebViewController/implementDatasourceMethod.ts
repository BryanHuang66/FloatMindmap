import {log} from "utils/common";
const viewWillDisappear = (animated:any) =>{
    self.webView.stopLoading(); 
    self.webView.delegate = null
    log(animated,"animated")
  }

const viewWillLayoutSubviews = ()=> {

}
const textFieldShouldReturn = (textField:any) =>{
  log("textfield","textField")
  Application.sharedInstance().studyController(self.window).becomeFirstResponder(); //For dismiss keyboard on iOS
}
const scrollViewDidScroll=()=>{
}


export default {
    viewWillDisappear,
    viewWillLayoutSubviews,
    textFieldShouldReturn,
    scrollViewDidScroll
  }
  