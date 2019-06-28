import { EventData } from "data/observable";
import { Page } from "ui/page";
import { LayoutBase } from "ui/layouts/layout-base";
import { Button } from "ui/button";
import { isIOS } from "platform";
import { topmost as topmostFrame, NavigationTransition } from "ui/frame";
import { NavPage } from "./nav-page";
import waterfall from "async-waterfall";

let availableTransitions = ["flip", "slide", "fade", "custom"];
let duration = 10000;
let wait = 2000;

if (isIOS) {
    availableTransitions.push("curl");
    duration = 20000;
}


export function onLoaded(args: EventData) {
    let mainPage = (<Page>args.object);
    let container = mainPage.getViewById<LayoutBase>("container");
    if (container.getChildrenCount() > 0) {
        return;
    }

    for (let i = 0, length = availableTransitions.length; i < length; i++) {
        let transitionName = availableTransitions[i];
        createButtons(transitionName, container, mainPage);
    }
}

function createButtons(transitionName: string, container: LayoutBase, mainPage: Page) {
    let button1 = new Button();

    // 1. navigate with transition
    // 2. navigate with go back
    button1.text = `${transitionName} trans -> go back`;
    button1.on("tap", (e) => {
        waterfall([
            function (callback) {
                navigate("1", transitionName);
                setTimeout(callback, duration + wait);
            },
            function (callback) {
                topmostFrame().goBack();
                setTimeout(callback, duration + wait);
            }
        ], function (err, result) {
            if (err) {
                throw err;
            }
        });
    });
    container.addChild(button1);

    // 1. navigate without transition
    // 2. navigate with transition
    // 3. navigate with clearHistory
    let button2 = new Button();
    button2.text = `no trans -> ${transitionName} trans`;
    button2.on("tap", (e) => {
        waterfall([
            function (callback) {
                navigate("1");
                setTimeout(callback, wait);
            },
            function (callback) {
                navigate("2", transitionName, true);
                setTimeout(callback, duration + wait);
            },
            function (callback) {
                topmostFrame().navigate({ create: () => mainPage, clearHistory: true, animated: false });
                callback();
            },
        ], function (err, result) {
            if (err) {
                throw err;
            }
        });
    });
    container.addChild(button2);

    // 1. navigate with transition
    // 2. navigate with transition and clearHistory
    // 3. navigate with clearHistory
    let button3 = new Button();
    button3.text = `${transitionName} trans -> ${transitionName} trans`;
    button3.on("tap", (e) => {
        waterfall([
            function (callback) {
                navigate("1", transitionName);
                setTimeout(callback, duration + wait);
            },
            function (callback) {
                navigate("2", transitionName, true);
                setTimeout(callback, duration + wait);
            },
            function (callback) {
                topmostFrame().navigate({ create: () => mainPage, clearHistory: true, animated: false });
                callback();
            },
        ], function (err, result) {
            if (err) {
                throw err;
            }
        });
    });
    container.addChild(button3);
}

function navigate(text: string, transitionName?: string, clearHistory?: boolean) {
    let navigationTransition = createNavigationTransition(transitionName);
    topmostFrame().navigate({
        create: () => new NavPage(text),
        animated: true,
        clearHistory: clearHistory,
        transition: navigationTransition,
    });
}

function createNavigationTransition(transitionName: string): NavigationTransition {
    let navigationTransition: NavigationTransition;
    if (transitionName === "custom") {
        let customTransitionModule = require("./custom-transition");
        let customTransition = new customTransitionModule.CustomTransition(duration);
        navigationTransition = {
            instance: customTransition
        };
    }
    else if (transitionName) {
        navigationTransition = {
            name: transitionName,
            duration: duration
        }
    }
    return navigationTransition;
}