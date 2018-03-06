// import { assert } from "chai";
// import { createDriver, AppiumDriver, SearchOptions, loadFrameComparer, FrameComparer } from "nativescript-dev-appium";
// import { FrameHelper } from "./helpers/frame-helper"
// import { IDevice } from "../../mobile-devices-controller/lib/device";
// import { TestHelper } from "./helpers/test-helper";

// describe("fliptrans->fliptransCH", function () {
//     let driver: AppiumDriver;
//     let frameComparer: FrameComparer;
//     let frameHelper: FrameHelper;
//     let testHelper: TestHelper;

//     before(async () => {
//         driver = await createDriver();
//         frameComparer = loadFrameComparer();
//         frameHelper = new FrameHelper(frameComparer);
//         testHelper = new TestHelper(driver);
//     });

//     afterEach(async function () {
//         frameHelper.reset();
//         if (this.currentTest.state === "failed") {
//             await driver.logScreenshot(flipTransFlipTransCHAutomationId);
//             await driver.logPageSource(flipTransFlipTransCHAutomationId);
//         }
//     });

//     const flipTransFlipTransCH = "flip trans -> flip trans + CH"
//     const flipTransFlipTransCHAutomationId = TestHelper.convertBtnNameToBtnAutomationId(flipTransFlipTransCH);

//     const compareFrames = async () => {
//         const startTime = Date.now();

//         switch (driver.nsCapabilities.device.name) {
//             case 'iPhone 7 110':
//                 await frameHelper.compareFrames(24, 5, 0.1);
//                 await frameHelper.compareFrames(48, 7, 0.1);
//                 await frameHelper.compareFrames(57, 8, 0.1);
//                 await frameHelper.compareFrames(65, 5, 0.1);
//                 // await Promise.all([
//                 //     frameHelper.compareFrames(24, 5, 0.1),
//                 //     frameHelper.compareFrames(48, 7, 0.1),
//                 //     frameHelper.compareFrames(57, 8, 0.1),
//                 //     frameHelper.compareFrames(65, 5, 0.1)
//                 // ]);
//                 break;
//             default:
//                 break;
//         }
//         console.log(`Totall: ${Date.now() - startTime}`);

//     }

//     it(flipTransFlipTransCH, async function () {
//         await driver.compareScreen("mainpage", 10, 0.01);

//         driver.startRecordingVideo(flipTransFlipTransCHAutomationId);

//         await testHelper.executeTransition(flipTransFlipTransCHAutomationId, 40000);

//         const path = await driver.stopRecordingVideo();
//         await frameComparer.processVideo(path, flipTransFlipTransCHAutomationId, flipTransFlipTransCHAutomationId);
//         await compareFrames();

//         frameHelper.assertFrames();
//     });
// });