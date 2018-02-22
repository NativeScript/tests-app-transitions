import { EventData } from "tns-core-modules/data/observable";
import { Page } from "tns-core-modules/ui/page";
import { LayoutBase } from "tns-core-modules/ui/layouts/layout-base";
import { Button } from "tns-core-modules/ui/button";
import { Label } from "tns-core-modules/ui/label";
import { isIOS, isAndroid } from "tns-core-modules/platform";
import { topmost as topmostFrame, NavigationTransition } from "tns-core-modules/ui/frame";
import { Color } from "tns-core-modules/color";
import { NavPage } from "./nav-page";
import { CustomTransition } from "./custom-transition";
const waterfall = require('async-waterfall');

const btnColors = ["#00e676", "#3d5afe"];

const availableTransitions = isIOS ?
    ["flip", "flip", "slide", "slide", "fade", "fade", "custom", "custom", "default", "default", "curl", "curl"] :
    ["default", "default", "custom", "custom", "explode", "explode",
        "flipLeft", "flipLeft", "flip", "flip",
        "slideTop", "slideTop", "slideBottom", "slideBottom", "slideRight", "slideRight", "slide", "slide",
        "fade", "fade", "no anim", "no anim"];

const duration = 1000;//platform.isIOS ? 1000 : 20000;
const wait = 2000;
const defaultContainer = "default-container";
const noTransContainer = "no-trans-container";
//const customContainer = "custom-container";//
const allContainer = "all-container";//

const createButton = (color: string) => {
    const btn = new Button();
    if (isAndroid) {
        btn.style.height = 25;
        btn.style.fontSize = 10;
        btn.style.padding = 0;
    } else {
        btn.style.padding = 5;
        btn.style.fontSize = 13;
    }
    btn.style.marginRight = 5;
    btn.style.marginBottom = 5;
    btn.style.color = new Color("white");
    btn.style.backgroundColor = new Color(color);
    btn.style.borderRadius = 5;

    return btn;
}

export function onLoaded(args: EventData) {
    const mainPage = (<Page>args.object);
    const getViewById = (id) => {
        return mainPage.getViewById<LayoutBase>(id);
    }
    const defaultContainerLayout = getViewById(defaultContainer);
    const noTransContainerLayout = getViewById(noTransContainer);
    const allContainerLayout = getViewById(allContainer);
    const containers: any = {};
    containers[noTransContainer] = noTransContainerLayout;
    containers[defaultContainer] = defaultContainerLayout;


    console.log("allContainerLayout::", allContainerLayout);
    console.log("container::", containers);
    if (allContainerLayout.getChildrenCount() > 0) {
        return;
    }

    const btn = createButton(btnColors[0]);
    btn.text = "all";
    btn.on('tap', (e) => {
        availableTransitions.forEach(v => {
            const animated = v !== availableTransitions[availableTransitions.length - 1];
            navigate(v, v, false, animated);
        })
    });

    allContainerLayout.addChild(btn);

    for (let i = 0, containerCounter = 0; i < availableTransitions.length; i += 2, containerCounter++) {
        console.log(`${containerCounter}`)
        createButtons(availableTransitions[i], containers, mainPage);
    }
}

function createButtons(transitionName: string, containers: any, mainPage: Page) {
    const fillContainer = (btn: Button) => {
        if (btn.text.startsWith("no trans") || btn.text.startsWith("custom")) {
            btn.style.backgroundColor = new Color(btnColors[1]);
            containers[noTransContainer].addChild(btn);
        } else {
            btn.style.backgroundColor = new Color(btnColors[0]);                        
            containers[defaultContainer].addChild(btn);
        }
    }

    const button1 = createButton(btnColors[0]);
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
    fillContainer(button1);

    const button2 = createButton(btnColors[1]);;
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
    fillContainer(button2);

    const button3 = createButton(btnColors[1]);

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
    fillContainer(button3);
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