import {Property} from "csstype";


/**
 * @type {string[]} Enthält die Farben der Punkte
 */
export const PointColors = ["red", "lime", "fuchsia", "gold", "darkgreen", "bisque", "navy", "deepskyblue"];

/**
 * Stellt einen Punkt im Koordinatensystem dar
 */
class Point {
    public x: number;
    public y: number;
    public sizeMultiplier: number;
    public header;
    public color: Property.BackgroundColor;

    /**
     * @param {number} x X-Wert
     * @param {number} y Y-Wert
     * @param {string} header Der Name des Punktes (Legendenbezeichnung, Tooltip-Header)
     * @param {number} sizeMultiplier Kann angegeben werden um die Größe des Punktes anzupassen
     * @param {Property.BackgroundColor} color Die Farbe des Punktes (Standard: Rot)
     */
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