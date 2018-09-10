import transition = require("ui/transition");

export class CustomTransition extends transition.Transition {
    public animateIOSTransition(containerView: UIView, fromView: UIView, toView: UIView, operation: UINavigationControllerOperation, completion: (finished: boolean) => void): void {
        let originalToViewTransform = toView.transform;
        let originalFromViewTransform = fromView.transform;

        //http://stackoverflow.com/questions/216076/uiview-scale-to-0-using-cgaffinetransformmakescale
        let scaleTransform = CGAffineTransformMakeScale(0.0001, 0.0001);
        
        toView.transform = scaleTransform;
        fromView.transform = CGAffineTransformIdentity;

        switch (operation) {
            case UINavigationControllerOperation.Push:
                containerView.insertSubviewAboveSubview(toView, fromView);
                break;
            case UINavigationControllerOperation.Pop:
                containerView.insertSubviewBelowSubview(toView, fromView);
                break;
        }

        let duration = this.getDuration();
        let curve = this.getCurve();
        UIView.animateWithDurationAnimationsCompletion(duration, () => {
            UIView.setAnimationCurve(curve);
            toView.transform = CGAffineTransformIdentity;
            fromView.transform = scaleTransform;
        }, (finished: boolean) => {
            toView.transform = originalToViewTransform; 
            fromView.transform = originalFromViewTransform; 
            completion(finished);   
        });
    }
}
