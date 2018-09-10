import transition = require("ui/transition");
export class CustomTransition extends transition.Transition {
    public createAndroidAnimation(transitionType: string): android.view.animation.Animation {
        var scaleValues = [];
        switch (transitionType) {
            case transition.AndroidTransitionType.enter:
            case transition.AndroidTransitionType.popEnter:
                scaleValues[0] = 0;
                scaleValues[1] = 1;
                break;
            case transition.AndroidTransitionType.exit:
            case transition.AndroidTransitionType.popExit:
                scaleValues[0] = 1;
                scaleValues[1] = 0;
                break;
        }

        const animationSet = new android.view.animation.AnimationSet(false);
        const duration = this.getDuration();
        if (duration !== undefined) {
            animationSet.setDuration(duration);
        }

        animationSet.setInterpolator(this.getCurve());
        animationSet.addAnimation(
            new android.view.animation.ScaleAnimation(
                scaleValues[0], 
                scaleValues[1], 
                scaleValues[0], 
                scaleValues[1],
                android.view.animation.Animation.RELATIVE_TO_SELF,
                0.5,
                android.view.animation.Animation.RELATIVE_TO_SELF,
                0.5
            ));

        return animationSet;
    }
}
