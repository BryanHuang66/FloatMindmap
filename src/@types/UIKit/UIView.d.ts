export {}

declare global {
  const enum UIViewAutoresizing {}
  class UIView extends UIResponder { 
    constructor(frame?: CGRect)
    opaque :boolean
    bounds: CGRect
    alpha: CGFloat
    frame: CGRect
    layer: CALayer
    hidden: boolean
    addSubview(view: UIView): void
    autoresizingMask: UIViewAutoresizing
    superview: UIView
    center: CGPoint
    tag: number
    convertRectToView(rect: CGRect, view: UIView): CGRect
    autoresizesSubviews: boolean
    addGestureRecognizer(gestureRecognizer: UIGestureRecognizer): void
    removeGestureRecognizer(gestureRecognizer: UIGestureRecognizer): void
    backgroundColor: UIColor
    static initWithFrame(
      frame:CGRect
    ):WrapperObj<any>
  }
  class CALayer {
    opaque: boolean
    backgroundColor : UIColor
    masksToBounds: boolean
    frame: CGRect
    cornerRadius: CGFloat
    borderWidth: CGFloat
    borderColor: UIColor
    opacity: CGFloat
    shadowOffset: CGSize
    shadowRadius: CGFloat
    shadowOpacity: CGFloat
    shadowColor: UIColor
  }
}
