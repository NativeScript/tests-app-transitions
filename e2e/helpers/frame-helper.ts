import { FrameComparer } from "nativescript-dev-appium";
import { assert } from "chai";

export class FrameHelper {
    private _imagesResults = new Map<string, boolean>();

    constructor(private frameComparer: FrameComparer) { }

    public async compareFrames(frameNumber, tolleranceRange = 10, tollerance = 0.01) {
        console.log(`Compare frame no: ${frameNumber}`)
        this._imagesResults.set(frameNumber, await this.frameComparer.compareFrames(frameNumber, tolleranceRange, tollerance));
    }

    public assertFrames() {
        for (let key in this._imagesResults) {
            assert.isTrue(this._imagesResults.get(key), `Image is not correct ${key}`);
        }
    }

    public reset() {
        this._imagesResults.clear();
    }
}