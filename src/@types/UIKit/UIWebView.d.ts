export {}
declare global {
    const enum UIDataDetectorTypes{}
    class UIWebView extends UIView{ 
        constructor(bounds: any) 
        readonly canGoForward?:boolean
        readonly scrollView:UIScrollView
        readonly canGoBack?:boolean
        scalesPageToFit?:boolean
        delegate?:WrapperObj<any>
        dataDetectorTypes?:UIDataDetectorTypes
        readonly request?:NSURLRequest
        readonly loading?:boolean
        customUserAgent?:string
        
        loadRequest(request:NSURLRequest):void
        loadHTMLStringbaseURL(
            string:string,
            baseURL:NSURL
            ):void
        loadDataMIMETypetextEncodingNamebaseURL(
            data:NSData,
            MIMEType:string,
            textEncodingName:string,
            baseURL:NSURL
        ):void
        loadFileURLAllowingReadAccessToURL(
            URL:NSURL,
            readAccessURL:NSURL
        ):void
        reload():void
        stopLoading():void
        goBack():void
        goForward():void
        evaluateJavaScriptcompletionHandler(
            javaScriptString:string,
            completionHandler:JSValue
        ):void
        takeSnapshotWithWidthcompletionHandler(
            width:CGFloat,
            completionHandler:JSValue
        ):void
    }
}