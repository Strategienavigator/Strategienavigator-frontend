import {CustomGrid} from "../CustomGrid";

import "./bcg-grid.scss";
import {ReactElement} from "react";


class BCGCustomGrid extends CustomGrid {

    constructor() {
        super(["BCG"]);
    }

    protected getItems(): ReactElement[] {
        return [
            <div key={"qm"}>Question Marks</div>,
            <div key={"stars"}>Stars</div>,
            <div key={"pd"}>Poor Dogs</div>,
            <div key={"cc"}>Cash Cows</div>
        ];
    }


}

export {
    BCGCustomGrid
}