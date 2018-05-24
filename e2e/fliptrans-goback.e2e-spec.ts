import { assert } from "chai";
import { createDriver, AppiumDriver, SearchOptions, loadFrameComparer, FrameComparer } from "nativescript-dev-appium";
import { FrameHelper } from "./helpers/frame-helper"
import { IDevice } from "../../mobile-devices-controller/lib/device";
import { TestHelper } from "./helpers/test-helper";

describe("transitions", function () {
    let driver: AppiumDriver;
    let frameComparer: FrameComparer;
    let frameHelper: FrameHelper;
    let testHelper: TestHelper;

    before(async () => {
        driver = await createDriver();
        frameComparer = loadFrameComparer();
        frameHelper = new FrameHelper(frameComparer);
        testHelper = new TestHelper(driver);
    });

    after(async () => {
        await driver.quit();
        console.log("Quit driver!");
    });

    afterEach(async function () {
        frameHelper.reset();
        if (this.currentTest.state === "failed") {
            await driver.logScreenshot(this.currentTest.title);
            await driver.logPageSource(this.currentTest.title);
        }
    });

    const framesToCompare = async () => {
        switch (driver.nsCapabilities.device.name) {
            case 'iPhone 7 110':
                await frameHelper.compareFrames(80, 7, 0.05);
                await frameHelper.compareFrames(125, 7, 0.05);
                await frameHelper.compareFrames(185, 7, 0.05);
                break;
            case 'Emulator-Api23-Default':
                await frameHelper.compareFrames(20, 7, 0.10);
                await frameHelper.compareFrames(34, 7, 0.10);
                await frameHelper.compareFrames(41, 7, 0.10);
                break;
            default:
                break;
        }
    }

    const flipTransGoBack = "flip trans -> go back"
    const btnAutomationId = TestHelper.convertBtnNameToBtnAutomationId(flipTransGoBack);
    it(flipTransGoBack, async function () {
        this.retries(2);
        await driver.compareScreen("mainpage", 5, 0.01);
        
        driver.startRecordingVideo(btnAutomationId);

        await testHelper.executeTransition(btnAutomationId);

        const path = await driver.stopRecordingVideo();
        await frameComparer.processVideo(path, btnAutomationId, btnAutomationId);
        await framesToCompare();

        frameHelper.assertFrames();
    });
});