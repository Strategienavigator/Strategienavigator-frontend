import {MatrixComponent} from "../../../../general-components/Tool/MatrixComponent/MatrixComponent";

import "./swot-analysis-matrix.scss";
import {Image} from "react-bootstrap";

import Beispiel from "./beispiel.png";


class SWOTAnalysisMatrix extends MatrixComponent<any> {

    render() {
        // TODO: Zur Swot-Analyse die Matrix bauen
        console.log(this.getData());

        return (
            <>
                <Image src={Beispiel}/>
            </>
        );
    }

}

export {
    SWOTAnalysisMatrix
}