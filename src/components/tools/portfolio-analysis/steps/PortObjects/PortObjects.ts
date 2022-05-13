import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {ComponentClass, FunctionComponent} from "react";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PortObjectsComponent} from "./PortObjectsComponent";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {
    CardComponentFields,
    isCardComponentFilled,
    isCardComponentTooLong
} from "../../../../../general-components/CardComponent/CardComponent";
import {PortObjectsCustomDescription, PortObjectsCustomDescriptionValues} from "./PortObjectsCustomDescription";


class PortObjects implements StepDefinition<PortfolioAnalysisValues>, StepDataHandler<PortfolioAnalysisValues> {
    public static min = 2;
    public static max = 8;


    public static getDefaultExtraValues(){
        return {
            quantity: "",
            quality: ""
        };
    }

    dataHandler: StepDataHandler<PortfolioAnalysisValues>;
    form: FunctionComponent<StepProp<PortfolioAnalysisValues>> | ComponentClass<StepProp<PortfolioAnalysisValues>>;
    id: string;
    title: string;

    constructor() {
        this.dataHandler = this;
        this.form = PortObjectsComponent;
        this.id = "port-objects";
        this.title = "1. Untersuchungsobjekte anlegen";
    }

    deleteData(data: Draft<PortfolioAnalysisValues>): void {
        data["port-objects"] = undefined;
    }

    fillFromPreviousValues(data: Draft<PortfolioAnalysisValues>): void {
        const portObjects: CardComponentFields<PortObjectsCustomDescriptionValues> = [];
        for (let i = 0; i < PortObjects.min; i++) {
            portObjects.push({
                id: null,
                desc: "",
                name: "",
                extra: PortObjects.getDefaultExtraValues()
            });
        }
        data["port-objects"] = {objects: portObjects};
    }

    isUnlocked(data: PortfolioAnalysisValues): boolean {
        return true;
    }

    validateData(data: PortfolioAnalysisValues): UIError[] {
        let errors: UIError[] = [];

        if (!isCardComponentFilled(data["port-objects"]?.objects)) {
            errors.push({
                id: "port-objects.empty",
                message: "Untersuchungsobjekte dürfen nicht leer sein!",
                level: "error"
            });
        }
        if (isCardComponentTooLong(data["port-objects"]?.objects)) {
            errors.push({
                id: "port-objects.too-long",
                message: "Der Text in einigen Feldern ist zu lang!",
                level: "error"
            });
        }

        if (data["port-objects"] !== undefined) {
            let empty = false;
            for (const field of data["port-objects"]?.objects) {
                empty = PortObjectsCustomDescription.isEmpty(field.extra);
                if (empty)
                    break; // TODO: change to while
            }

            if (empty) {
                errors.push({
                    id: "port-objects.q&q",
                    message: "Bitte geben Sie Qualitative & Quantitative Begründungen an!",
                    level: "error"
                });
            }
        }


        return errors;
    }

}

export {
    PortObjects
}
