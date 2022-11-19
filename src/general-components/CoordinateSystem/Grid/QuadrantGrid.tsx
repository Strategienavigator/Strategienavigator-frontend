import {CustomGrid} from "./CustomGrid";

import "./BCG/bcg-grid.scss";


class QuadrantGrid extends CustomGrid {
    private quadrants: string[] = [];

    constructor(quadrants: string[]) {
        super(["quadrants"]);
        this.quadrants = quadrants;
    }

    protected getItems(): React.ReactElement[] {
        let classes = ["ul", "ur", "bl", "br"];
        return this.quadrants.map((v, i) => {
            return (
                <div
                    className={classes[i]}
                    key={`quadrant-${i}-${v}`}
                >{v}</div>
            );
        })
    }

}

export {
    QuadrantGrid
}