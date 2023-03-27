import {faThLarge} from "@fortawesome/free-solid-svg-icons";
import {PersonaFactorsValues} from "./steps/PersonaFactors/PersonaFactorsComponent";
import {UploadImgValues} from "./steps/UpdateImgAndBaseInfo/UpdateImgBaseInfoComponent";
import "./persona-analysis.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {JSONExporter} from "../../../general-components/Export/JSONExporter";
// import {SWOTExcelExporter} from "./export/SWOTExcelExporter";
import {RouteComponentProps} from "react-router";
import {PersonaFactors} from "./steps/PersonaFactors/PersonaFactors"

import {ImgFactors} from "./steps/UpdateImgAndBaseInfo/UpdateImgBaseInfoFactors";
import { PersonaShow } from "./steps/PersonaShow/PersonaShow";
                // import {SWOTJSONImporter} from "./import/SWOTJSONImporter";


interface PersonaAnalysisValues {
    "persona-factors"?: PersonaFactorsValues,
    "uploadImage_actions"?: UploadImgValues ,
}

class PersonaAnalysis extends SteppableTool<PersonaAnalysisValues> {

    constructor(props: RouteComponentProps<{ id: string }>, context: any) {
        super(props, context, "Persona", faThLarge, 3);

                this.addExporter(new JSONExporter());
                this.addStep(new ImgFactors());
                this.addStep(new PersonaFactors());
                this.addStep(new PersonaShow());   
    }

    protected renderShortDescription() {
        return null;
    }

    protected renderTutorial() {
        return (
            <p>
                Persona info 
            </p>
        );
    }

    protected getInitData(): PersonaAnalysisValues {
        let data: PersonaAnalysisValues = {};
        this.getStep(0).dataHandler.fillFromPreviousValues(data);
        return data;
    }

}

export {
    PersonaAnalysis
}

export type {
    PersonaAnalysisValues
}
