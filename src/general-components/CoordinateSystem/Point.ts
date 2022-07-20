import {Property} from "csstype";


export const PointColors = ["red", "blue", "green", "yellow", "orange", "gold", "violet", "cyan"];

class Point {
    public sizeMultiplier: number;
    public header;
    public x: number;
    public y: number;
    public color: Property.BackgroundColor;

    constructor(x: number, y: number, header: string, sizeMultiplier: number, color?: Property.BackgroundColor) {
        this.x = x;
        this.y = y;
        this.sizeMultiplier = sizeMultiplier;
        this.header = header;

        if (color) {
            this.color = color;
        } else {
            this.color = "red";
        }
    }

}

export {
    Point
}