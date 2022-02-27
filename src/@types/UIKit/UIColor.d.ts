export {}
declare global {
  class UIColor {
    static lightTextColor(): UIColor
    static darkTextColor(): UIColor
    static groupTableViewBackgroundColor(): UIColor
    static viewFlipsideBackgroundColor(): UIColor
    static scrollViewTexturedBackgroundColor(): UIColor
    static underPageBackgroundColor(): UIColor
    static colorWithHexString(rgbHex: string): UIColor
    static blackColor(): UIColor
    static darkGrayColor(): UIColor
    static lightGrayColor(): UIColor
    static whiteColor(): UIColor
    static grayColor(): UIColor
    static redColor(): UIColor
    static greenColor(): UIColor
    static blueColor(): UIColor
    static cyanColor(): UIColor
    static yellowColor(): UIColor
    static magentaColor(): UIColor
    static orangeColor(): UIColor
    static purpleColor(): UIColor
    static brownColor(): UIColor
    static clearColor(): UIColor
    static colorWithString():UIColor
    static colorWithHexString():UIColor
    static colorWithRGBHex():UIColor
    static colorWithWhiteAlpha(white:CGFloat,alpha:CGFloat):UIColor
    colorWithAlphaComponent(alpha: CGFloat): UIColor
    
    getRedGreenBlueAlpha():NSDictionary
    getHueSaturationBrightnessAlpha():NSDictionary
    colorWithAlphaComponent():UIColor

    readonly stringValue: string
    readonly hexStringValue: string
    readonly valueString: string

    static blendedColor(
      foregroundColor:UIColor,
      backgroundColor:UIColor,
      percentBlend:CGFloat
    ):UIColor
  }
}
