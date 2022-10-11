import {CustomGrid} from "../CustomGrid";

import "./bcg-grid.scss";
import {ReactElement} from "react";


/**
 * Stellt das BCG-Grid dar
 */
class BCGCustomGrid extends CustomGrid {

    constructor() {
        super(["BCG"]);
    }

    protected getItems(): ReactElement[] {
        return [
            <div key={"bcg-ul"} className={"ul"}>Question Marks</div>,
            <div key={"bcg-ur"} className={"ur"}>Stars</div>,
            <div key={"bcg-bl"} className={"bl"}>Poor Dogs</div>,
            <div key={"bcg-br"} className={"br"}>Cash Cows</div>
        ];
    }


}

export {
    BCGCustomGrid
}