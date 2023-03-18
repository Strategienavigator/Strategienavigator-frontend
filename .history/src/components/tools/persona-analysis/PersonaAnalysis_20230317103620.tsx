import {faThLarge} from "@fortawesome/free-solid-svg-icons";
import {PersonaFactorsValues} from "./steps/PersonaFactors/PersonaFactorsComponent";
import {PersonaFactorsValues2} from "./steps/PersonaFactors copy/PersonaFactorsComponent";
import {UploadImgValues} from "./steps/SWOTAlternativeActions/UpdateImgActionsValuesComponent";
import "./persona-analysis.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {JSONExporter} from "../../../general-components/Export/JSONExporter";
// import {SWOTExcelExporter} from "./export/SWOTExcelExporter";
import {RouteComponentProps} from "react-router";
import {PersonaFactors} from "./steps/PersonaFactors/PersonaFactors"
import {PersonaFactors2} from "./steps/PersonaFactors copy/PersonaFactors"
import {ImgFactors} from "./steps/SWOTAlternativeActions/UpdateImgFactors";
                // import {SWOTJSONImporter} from "./import/SWOTJSONImporter";


interface PersonaAnalysisValues {
    "persona-factors"?: PersonaFactorsValues,
    "uploadImage_actions"?: UploadImgValues ,
    "persona-factors2"?: PersonaFactorsValues2,

}

class PersonaAnalysis extends SteppableTool<PersonaAnalysisValues> {

    constructor(props: RouteComponentProps<{ id: string }>, context: any) {
        super(props, context, "Persona", faThLarge, 5);

        //this.addExporter(new JSONExporter());
        //this.addExporter(new SWOTExcelExporter());

        
                //this.setImporter(new SWOTJSONImporter());
                
                this.addStep(new PersonaFactors());
                this.addStep(new PersonaFactors());
                // this.addStep(new ImgFactors());
               
               
                // this.addStep(new PersonaFactors());
                //  this.addStep(new PersonaFactors2());
                
        
            }

            protected renderShortDescription() {
                return null;
    }

    protected renderTutorial() {
        return (
            <p>
                Eine gute SWOT-Analyse kombiniert sowohl <b>interne Einflussfaktoren</b> als auch <b>externe
                Einflussfaktoren</b>.
                Interne Einflussfaktoren zeichnen sich in erster Linie dadurch aus, dass sie sich direkt durch
                das Unternehmen beeinflussen lassen. Folglich spricht man hier auch
                von <b>"Stärken"</b> und <b>"Schwächen"</b>.
                Beispiele hierzu wären ein besonders guter Kundenservice oder eine besonders hohe Mitarbeitermotivation.
                Externe Einflussfaktoren bezeichnen dahingegen <b>"Chancen"</b> und <b>"Risiken"</b>, welche sich nicht
                durch
                das Unternehmen beeinflussen lassen und demzufolge auf eine gesamte Branche oder sogar Markt einwirken.
                Hierzu gehören zum Beispiel Faktoren wie der Klimawandel oder der Digitalisierungsschub durch die
                Corona-Pandemie.
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
