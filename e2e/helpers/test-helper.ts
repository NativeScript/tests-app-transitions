import { AppiumDriver } from "nativescript-dev-appium";
import { FrameHelper } from "./frame-helper";

export class TestHelper {
    constructor(private _driver: AppiumDriver){
    }

    public executeTransition = async (buttonAutomationId, waitTimeout = 20000) => {
        const btnRunAllTransitionsAtOnce = (await this._driver.findElementByAccessibilityId(buttonAutomationId, 10));
        const btnLocation = await btnRunAllTransitionsAtOnce.location();
        await btnRunAllTransitionsAtOnce.tap();

        const shouldNotTimeout = (initTime) => Date.now() - initTime <= waitTimeout;

        let btnIsDisplayed = await btnRunAllTransitionsAtOnce.isDisplayed();
        let startTime = Date.now();
        while (shouldNotTimeout(startTime) && btnIsDisplayed) {
            console.log(`${buttonAutomationId} btn is displayed!`);
            btnIsDisplayed = await btnRunAllTransitionsAtOnce.isDisplayed();
        }

        btnIsDisplayed = await btnRunAllTransitionsAtOnce.isDisplayed();

        startTime = Date.now();
        while (shouldNotTimeout(startTime) && !btnIsDisplayed) {
            console.log(`${buttonAutomationId} btn is not displayed!`);
            btnIsDisplayed = await btnRunAllTransitionsAtOnce.isDisplayed();
        }

        let curruntBtnLocation = await btnRunAllTransitionsAtOnce.location();
        startTime = Date.now();
        while (shouldNotTimeout(startTime) && (curruntBtnLocation.x !== btnLocation.x || curruntBtnLocation.y !== btnLocation.y)) {
            console.log(`${buttonAutomationId} btn x: ${curruntBtnLocation.x}; y: ${curruntBtnLocation.y}!`);
            curruntBtnLocation = (await btnRunAllTransitionsAtOnce.location());
        }

        await this._driver.compareScreen("mainpage", 5, 0.01);
    }

    public static convertBtnNameToBtnAutomationId = (btn) => {
        return btn.replace("->", "").replace(/\s/ig, "");
    }
}
