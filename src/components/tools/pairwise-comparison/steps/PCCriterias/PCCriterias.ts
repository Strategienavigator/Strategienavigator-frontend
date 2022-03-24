import {PairwiseComparisonValues} from "../../PairwiseComparison";
import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {PCCriteriasComponent} from "./PCCriteriasComponent";
import {
    CardComponentFields,
    isCardComponentFilled, isCardComponentTooLong
} from "../../../../../general-components/CardComponent/CardComponent";


class PCCriterias implements StepDefinition<PairwiseComparisonValues>, StepDataHandler<PairwiseComparisonValues> {
    id: string;
    title: string;
    dataHandler: StepDataHandler<PairwiseComparisonValues>;
    form: React.FunctionComponent<StepProp<PairwiseComparisonValues>> | React.ComponentClass<StepProp<PairwiseComparisonValues>>;


    constructor() {
        this.id = "pc-criterias";
        this.title = "1. Kritierien festlegen";
        this.dataHandler = this;
        this.form = PCCriteriasComponent;
    }

    deleteData(data: Draft<PairwiseComparisonValues>): void {
        data["pc-criterias"] = undefined;
    }

    fillFromPreviousValues(data: Draft<PairwiseComparisonValues>): void {
        const criterias: CardComponentFields = [];
        criterias.push({
            id: null,
            name: "",
            desc: ""
        }, {
            id: null,
            name: "",
            desc: ""
        });

        data["pc-criterias"] = {criterias: criterias};
    }


    isUnlocked(data: PairwiseComparisonValues): boolean {
        return true;
    }

    /**
     * Methode zum validieren der Werte
     * Es müssen mindestens 2 Kriterien angegeben werden damit ein leeres array zurückgegeben wird
     *
     * @param {PairwiseComparisonValues} data
     * @returns {UIError[]}
     */
    validateData(data: PairwiseComparisonValues): UIError[] {
        const errors = new Array<UIError>();
        const criterias = data["pc-criterias"]?.criterias;
        if (criterias === undefined) {
            errors.push({
                message: "Daten fehlen",
                level: "error",
                id: "pairwise-comparison.missing"
            });
        } else {
            if (criterias.length < 2) {
                errors.push({
                    message: "Sie müssen mindestens 2 Kriterien samt Beschreibung angeben, um fortfahren zu können.",
                    level: "error",
                    id: "pairwise-comparison.criterias"
                });
            } else {
                if (!isCardComponentFilled(criterias)) {
                    errors.push({
                        message: "Kriterien dürfen nicht leer sein!",
                        level: "error",
                        id: "pairwise-comparison.criterias-empty"
                    });
                }
                if (isCardComponentTooLong(criterias)) {
                    errors.push({
                        message: "Der Text in einigen Feldern ist zu lang!",
                        level: "error",
                        id: "pairwise-comparison.criterias-too-long"
                    });
                }
            }
        }

        return errors;
    }


}

export {
    PCCriterias
}
