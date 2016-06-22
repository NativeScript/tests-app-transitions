import { EventData } from "data/observable";
import { Page } from "ui/page";
import { LayoutBase } from "ui/layouts/layout-base";
import { Button } from "ui/button";
import { Label } from "ui/label";
import * as platform from "platform";
import { topmost as topmostFrame, NavigationTransition} from "ui/frame";
import { NavPage } from "./nav-page";

let waterfall = require('async-waterfall');

let availableTransitions = ["flip", "slide", "fade", "custom"];
if (platform.device.os === platform.platformNames.ios) {
    availableTransitions = availableTransitions.concat(["curl"]);
}

let duration = 10000;
let wait = 2000;

export function onLoaded(args: EventData) {
    let mainPage = (<Page>args.object);
    let container = mainPage.getViewById<LayoutBase>("container");
    if (container.getChildrenCount() > 0) {
        return;
    }
    
    for (let i = 0, length = availableTransitions.length; i < length; i++){    
        let transitionName = availableTransitions[i];
        createButtons(transitionName, container, mainPage, false);     
    }

    if (platform.isAndroid){
        createButtons("slide", container, mainPage, true);     
    }
}

function createButtons(transitionName: string, container: LayoutBase, mainPage: Page, cachePagesOnNavigate: boolean){
    let button1 = new Button();
    button1.text = `${transitionName} trans -> go back${cachePagesOnNavigate ? " + CPON" : ""}`;
    button1.on("tap", (e) => {
        waterfall([
            function(callback){
                if (platform.isAndroid){
                    topmostFrame().android.cachePagesOnNavigate = cachePagesOnNavigate;
                }
                callback();
            },
            function(callback){
                navigate("1", transitionName);                    
                setTimeout(callback, duration + wait);                   
            },
            function(callback){
                topmostFrame().goBack(); 
                setTimeout(callback, duration + wait);
            }
        ], function (err, result) {
            if (platform.isAndroid){
                topmostFrame().android.cachePagesOnNavigate = false;
            }
            if (err){
                throw err;
            }
        });
    });
    container.addChild(button1);

    let button2 = new Button();
    button2.text = `no trans -> ${transitionName} trans + CH${cachePagesOnNavigate ? " + CPON" : ""}`;
    button2.on("tap", (e) => {
        waterfall([
            function(callback){
                if (platform.isAndroid){
                    topmostFrame().android.cachePagesOnNavigate = cachePagesOnNavigate;
                }
                callback();
            },
            function(callback){
                navigate("1");                    
                setTimeout(callback, wait);                   
            },
            function(callback){
                navigate("2", transitionName, true);                    
                setTimeout(callback, duration + wait);                   
            },
            function(callback){
                if (platform.isAndroid){
                    topmostFrame().android.cachePagesOnNavigate = false;
                }
                topmostFrame().navigate({create: () => mainPage, clearHistory: true, animated: false}); 
                callback();
            },
        ], function (err, result) {
            if (err){
                throw err;
            }
        });
    });
    container.addChild(button2);
    
    let button3 = new Button();
    button3.text = `${transitionName} trans -> ${transitionName} trans + CH${cachePagesOnNavigate ? " + CPON" : ""}`;
    button3.on("tap", (e) => {
        waterfall([
            function(callback){
                if (platform.isAndroid){
                    topmostFrame().android.cachePagesOnNavigate = cachePagesOnNavigate;
                }
                callback();
            },
            function(callback){
                navigate("1", transitionName);                    
                setTimeout(callback, duration + wait);                   
            },
            function(callback){
                navigate("2", transitionName, true);                    
                setTimeout(callback, duration + wait);                   
            },
            function(callback){
                if (platform.isAndroid){
                    topmostFrame().android.cachePagesOnNavigate = false;
                }
                topmostFrame().navigate({create: () => mainPage, clearHistory: true, animated: false}); 
                callback();
            },
        ], function (err, result) {
            if (err){
                throw err;
            }
        });
    });
    container.addChild(button3);
}

function navigate(text: string, transitionName?: string, clearHistory?: boolean){
    let navigationTransition = createNavigationTransition(transitionName);
    topmostFrame().navigate({
        create: () => new NavPage(text),
        animated: true,
        clearHistory: clearHistory,
        transition: navigationTransition,
    });
}

function createNavigationTransition(transitionName: string): NavigationTransition{
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