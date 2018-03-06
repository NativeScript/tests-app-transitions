import { assert } from "chai";
import { createDriver, AppiumDriver, SearchOptions, loadFrameComparer, FrameComparer } from "nativescript-dev-appium";
import { FrameHelper } from "./helpers/frame-helper"
import { IDevice } from "../../mobile-devices-controller/lib/device";
import { TestHelper } from "./helpers/test-helper";

describe("transitions - flip trans", function () {
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

    const flipTransGoBack = "flip trans -> go back"
    const flipTransGoBackBtnAutomationId = TestHelper.convertBtnNameToBtnAutomationId(flipTransGoBack);

    afterEach(async function () {
        frameHelper.reset();
        if (this.currentTest.state === "failed") {
            await driver.logScreenshot(flipTransGoBackBtnAutomationId);
            await driver.logPageSource(flipTransGoBackBtnAutomationId);
        }
    });

    const compareFrames = async () => {
        const startTime = Date.now();
        switch (driver.nsCapabilities.device.name) {
            case 'iPhone 7 110':
            // await frameHelper.compareFrames(68, 10, 0.05);
            // await frameHelper.compareFrames(125, 10, 0.05);
            // await frameHelper.compareFrames(158, 10, 0.1);
            await Promise.all([
                frameHelper.compareFrames(68, 10, 0.05),
                frameHelper.compareFrames(125, 10, 0.05),
                frameHelper.compareFrames(158, 10, 0.1)]);
                break;
            default:
                break;
        }

        console.log(`Totall: ${Date.now() - startTime}`);
    }

    it(flipTransGoBack, async function () {
        //this.retries(2);
        await driver.compareScreen("mainpage", 5, 0.01);

        driver.startRecordingVideo(flipTransGoBackBtnAutomationId);

        await testHelper.executeTransition(flipTransGoBackBtnAutomationId);

        const path = await driver.stopRecordingVideo();
        await frameComparer.processVideo(path, flipTransGoBackBtnAutomationId, flipTransGoBackBtnAutomationId);
        await compareFrames();

        frameHelper.assertFrames();
    });
});