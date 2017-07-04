import { Page } from "tns-core-modules/ui/page";
import { Label } from "tns-core-modules/ui/label";

let i = 0;
export class NavPage extends Page {
    private static _id = -1;
    
    constructor(text: string) {
        super();
        NavPage._id++;
        this.id = NavPage._id.toString();
        this.style.backgroundColor = <any>((i % 2 == 0) ? 'blue' : 'yellow');
        const label = new Label();
        label.textWrap = true;
        label.text = text;
        label.style.fontSize = 20;
        label.horizontalAlignment = "stretch";
        label.verticalAlignment = "stretch";
        label.textAlignment = "center";
        this.content = label;
        i++
    }
}