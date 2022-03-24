import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {UtilInvestigationObjectsComponent} from "./UtilInvestigationObjectsComponent";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {
    CardComponentFields,
    isCardComponentFilled, isCardComponentTooLong
} from "../../../../../general-components/CardComponent/CardComponent";


class UtilInvestigationObjects implements StepDefinition<UtilityAnalysisValues>, StepDataHandler<UtilityAnalysisValues> {
    public static min = 2;
    public static max = 10;


    dataHandler: StepDataHandler<UtilityAnalysisValues>;
    form: React.FunctionComponent<StepProp<UtilityAnalysisValues>> | React.ComponentClass<StepProp<UtilityAnalysisValues>>;
    id: string;
    title: string;


    constructor() {
        this.id = "ua-investigation-obj";
        this.title = "1. Untersuchungsobjekte";
        this.form = UtilInvestigationObjectsComponent;
        this.dataHandler = this;
    }

    deleteData(data: Draft<UtilityAnalysisValues>): void {
        data["ua-investigation-obj"] = undefined;
    }

    fillFromPreviousValues(data: Draft<UtilityAnalysisValues>): void {
        const investigationObjects: CardComponentFields = [];
        for (let i = 0; i < UtilInvestigationObjects.min; i++) {
            investigationObjects.push({id: null, desc: "", name: ""});
        }
        data["ua-investigation-obj"] = {objects: investigationObjects};
    }

    isUnlocked(data: UtilityAnalysisValues): boolean {
        return true;
    }

    validateData(data: UtilityAnalysisValues): UIError[] {
        const erros: UIError[] = [];
        if (!isCardComponentFilled(data["ua-investigation-obj"]?.objects)) {
            erros.push({
                id: "investigation-objects.empty",
                level: "error",
                message: "Die Objekte dürfen nicht leer sein!"
            });
        }
        if (isCardComponentTooLong(data["ua-investigation-obj"]?.objects)) {
            erros.push({
                id: "investigation-objects.too-long",
                level: "error",
                message: "Der Text in einigen Feldern ist zu lang!"
            });
        }

        return erros;
    }

}

export {
    UtilInvestigationObjects
}
