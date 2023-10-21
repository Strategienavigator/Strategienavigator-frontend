import {Property} from "csstype";


/**
 * @type {string[]} Enthält die Farben der Punkte
 */
export const PointColors = [
    "rgb(255, 0, 0)", // red
    "rgb(0, 255, 0)", // lime
    "rgb(255, 0, 255)", // fuchsia
    "rgb(255, 215, 0)", // gold
    "rgb(0, 100, 0)", // darkgreen
    "rgb(255, 228, 196)", // bisque
    "rgb(0, 0, 128)", // navy
    "rgb(0, 191, 255)" // deepskyblue
];

/**
 * Gibt eine zufällige Farbe zurück
 */
export const getRandomPointColor = (): string => {
    let length = PointColors.length;
    let randomIndex = Math.floor(Math.random() * (length));
    return PointColors[randomIndex];
}

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
     * @param {number} sizeMultiplier Kann angegeben werden, um die Größe des Punktes anzupassen
     * @param {string} color Die Farbe des Punktes (Standard: Rot), RGB
     */
    constructor(x: number, y: number, header: string, sizeMultiplier: number, color?: string) {
        this.x = x;
        this.y = y;
        this.sizeMultiplier = sizeMultiplier;
        this.header = header;

        if (color) {
            this.color = color;
        } else {
            this.color = getRandomPointColor();
        }
    }

    public toString(): string {
        return `(${this.x}, ${this.y})`;
    }

}

export {
    Point
}