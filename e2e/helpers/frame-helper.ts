import { FrameComparer } from "nativescript-dev-appium";
import { assert } from "chai";

export class FrameHelper {
    private _imagesResults = new Map<string, boolean>();

    constructor(private frameComparer: FrameComparer) { }

    public async compareFrames(frameNumber, tolleranceRange = 10, tollerance = 0.01) {
        console.log(`Compare frame number: ${frameNumber}`);
        const result = await this.frameComparer.compareFrames(frameNumber, tolleranceRange, tollerance);
        this._imagesResults.set(frameNumber, result);
    }

    public assertFrames() {
        let shouldFailTest = false;
        console.log();
        console.log("==============================");
        this._imagesResults.forEach((v, k, map) => {
            if (!this._imagesResults.get(k)) {
                console.log(`Frame ${k} is not correct!!!`);
                shouldFailTest = true;
            }else{
                console.log(`Frame ${k} is correct!!!`);                
            }
        });

        assert.isFalse(shouldFailTest, "Frame comparing failed!!!");
        console.log("==============================");
        console.log();        
    }

    public reset() {
        this._imagesResults.clear();
    }
}