import { assert } from "chai";
import { createDriver, AppiumDriver, SearchOptions, loadFrameComparer, FrameComparer } from "nativescript-dev-appium";
import { FrameHelper } from "./helpers/frame-helper"

describe("transitions", function () {
    const defaultWaitTime = 5000;
    let driver: AppiumDriver;
    let frameComparer: FrameComparer;
    let frameHelper: FrameHelper;

    before(async () => {
        driver = await createDriver();
        frameComparer = loadFrameComparer();
        frameHelper = new FrameHelper(frameComparer);
    });

    after(async () => {
        await driver.quit();
        console.log("Quit driver!"); 5
    });

    afterEach(async function () {
        frameHelper.reset();
        if (this.currentTest.state === "failed") {
            await driver.logScreenshot(this.currentTest.title);
        }
    });

    const flipTransGoBack = "flip trans -> go back"
    it(flipTransGoBack, async function () {
        const videoPath = driver.startRecordingVideo(flipTransGoBack);
        const btnRunAllTransitionsAtOnce = (await driver.findElementsByClassName(driver.locators.button))[1];
        await btnRunAllTransitionsAtOnce.click()

        const btn = await driver.findElementByAccessibilityId(flipTransGoBack, 80);
        console.log(`${flipTransGoBack} isDisplayed(): ${await btn.isDisplayed()}`);
        while (!(await btn.isDisplayed())) {
            console.log(`${flipTransGoBack} btn is not displayed!`)
        }

        while ((await btn.location()).x > 10) {
            console.log(`${flipTransGoBack} btn x: ${(await btn.location()).x}!`)
        }

        const path = await driver.stopRecordingVideo();
        await frameComparer.processVideo(path, flipTransGoBack);

        frameHelper.compareFrames(8, 10, 0.01);
        frameHelper.compareFrames(32, 10, 0.01);
        frameHelper.compareFrames(44, 10, 0.01);

        frameHelper.assertFrames();
    });
});