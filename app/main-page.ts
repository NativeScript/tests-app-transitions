import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { Button } from "tns-core-modules/ui/button";
import { Label } from "tns-core-modules/ui/label";
import { isIOS, isAndroid } from "tns-core-modules/platform";
import { topmost as topmostFrame, NavigationTransition } from "tns-core-modules/ui/frame";
import { NavPage } from "./nav-page";
import { CustomTransition } from "./custom-transition";

let waterfall = require('async-waterfall');

const availableTransitions = isIOS ?
    ["flip", "flip", "slide", "slide", "fade", "fade", "custom", "custom", "default", "default", "curl", "curl"] :
    ["default", "default", "custom", "custom", "explode", "explode", 
    "flipLeft", "flipLeft", "flip", "flip", 
    "slideTop", "slideTop", "slideBottom", "slideBottom", "slideRight", "slideRight", "slide", "slide", 
    "fade", "fade", "no anim", "no anim"];
const duration = 1000;//platform.isIOS ? 1000 : 20000;
const wait = 2000;

export function onLoaded(args: EventData) {
    const mainPage = (<Page>args.object);
    const container = mainPage.getViewById<LayoutBase>("container");
    if (container.getChildrenCount() > 0) {
        return;
    }

    const btn = new Button();
    btn.text = "all";
    btn.on('tap', (e) => {
        availableTransitions.forEach(v => {
            const animated = v !== availableTransitions[availableTransitions.length - 1];
            navigate(v, v, false, animated);
        })
    });
    container.addChild(btn);

    for (let i = 0; i < availableTransitions.length; i += 2) {
        createButtons(availableTransitions[i], container, mainPage);
    }
}

function createButtons(transitionName: string, container: LayoutBase, mainPage: Page) {
    const button1 = new Button();

    button1.text = `${transitionName} trans -> go back`;
    button1.on("tap", (e) => {
        waterfall([
            function (callback) {
                callback();
            },
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

    const button2 = new Button();
    button2.text = `no trans -> ${transitionName} trans + CH`;
    button2.on("tap", (e) => {
        waterfall([
            function (callback) {
                callback();
            },
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

    const button3 = new Button();

    button3.text = `${transitionName} trans -> ${transitionName} trans + CH`;
    button3.on("tap", (e) => {
        waterfall([
            function (callback) {
                callback();
            },
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

function navigate(text: string, transitionName?: string, clearHistory: boolean = false, animated: boolean = true) {
    topmostFrame().navigate({
        create: () => new NavPage(text),
        animated: animated,
        clearHistory: clearHistory,
        transition: {
            name: transitionName,
            duration: duration,
            instance: transitionName === "custom" ? new CustomTransition(duration, null) : null
        }
    });
}