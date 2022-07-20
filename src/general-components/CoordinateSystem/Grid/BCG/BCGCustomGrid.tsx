import {CustomGrid} from "../CustomGrid";

import "./bcg-grid.scss";
import {ReactElement} from "react";


class BCGCustomGrid extends CustomGrid {

    constructor() {
        super(["BCG"]);
    }

    protected getItems(): ReactElement[] {
        return [
            <div key={"qm"} className={"qm"}>Question Marks</div>,
            <div key={"stars"} className={"stars"}>Stars</div>,
            <div key={"pd"} className={"pd"}>Poor Dogs</div>,
            <div key={"cc"} className={"cc"}>Cash Cows</div>
        ];
    }


}

export {
    BCGCustomGrid
}