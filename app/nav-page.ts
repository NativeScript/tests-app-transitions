import { Page } from "ui/page";
import { Color } from "color";
import { Label } from "ui/label";
import { topmost } from "ui/frame";

export class NavPage extends Page {
    private static _id = -1;
    private static _blue = new Color("blue");
    private static _yellow = new Color("yellow");
    
    constructor(text: string) {
        super();
        NavPage._id++;
        this.id = NavPage._id.toString();
        this.style.backgroundColor = topmost().currentPage.style.backgroundColor === NavPage._yellow ? NavPage._blue : NavPage._yellow;
        let label = new Label();
        label.text = text;
        label.style.fontSize = 200;
        label.horizontalAlignment = "stretch";
        label.verticalAlignment = "stretch";
        label.textAlignment = "center";
        this.content = label;
    }
}