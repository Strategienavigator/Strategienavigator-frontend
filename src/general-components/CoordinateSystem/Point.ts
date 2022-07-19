class Point {
    public sizeMultiplier: number;
    public header;
    public x: number;
    public y: number;

    constructor(x: number, y: number, header: string, sizeMultiplier: number) {
        this.x = x;
        this.y = y;
        this.sizeMultiplier = sizeMultiplier;
        this.header = header;
    }

}

export {
    Point
}