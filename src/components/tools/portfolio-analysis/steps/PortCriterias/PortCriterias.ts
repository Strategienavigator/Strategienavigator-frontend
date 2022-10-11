import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {ComponentClass, FunctionComponent} from "react";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {PortCriteriasComponent} from "./PortCriteriasComponent";
import {Card} from "../../../../../general-components/CardComponent/Card";
import {
    isCardComponentFilled,
    isCardComponentTooLong
} from "../../../../../general-components/CardComponent/CardComponent";
import {PortEvaluation} from "../PortEvaluation/PortEvaluation";


export class PortCriterias implements StepDefinition<PortfolioAnalysisValues>, StepDataHandler<PortfolioAnalysisValues> {
    static header = PortEvaluation.header;
    static MIN: number = 2;
    static MAX: number = 6;
    dataHandler: StepDataHandler<PortfolioAnalysisValues>;
    form: FunctionComponent<StepProp<PortfolioAnalysisValues>> | ComponentClass<StepProp<PortfolioAnalysisValues>>;
    id: string;
    title: string;

    constructor() {
        this.dataHandler = this;
        this.form = PortCriteriasComponent;
        this.id = "port-criterias";
        this.title = "2. Kriterien festlegen";
    }

    deleteData(data: Draft<PortfolioAnalysisValues>): void {
        data["port-criterias"] = undefined;
    }

    fillFromPreviousValues(data: Draft<PortfolioAnalysisValues>): void {
        data["port-criterias"] = {
            "attractivity": [
                Card.empty(PortCriterias.getDefaultExtraData()),
                Card.empty(PortCriterias.getDefaultExtraData())
            ],
            "comp-standing": [
                Card.empty(PortCriterias.getDefaultExtraData()),
                Card.empty(PortCriterias.getDefaultExtraData())
            ]
        };
    }

    static getDefaultExtraData() {
        return {
            headers: PortCriterias.header.getHeaders(),
            activeIndices: Array(PortCriterias.header.getCount()).fill(0).map((_, i) => i + 1)
        };
    }

    isUnlocked(data: PortfolioAnalysisValues): boolean {
        return data["port-criterias"] !== undefined;
    }

    validateData(data: PortfolioAnalysisValues): UIError[] {
        let criterias = data["port-criterias"];
        let errors: UIError[] = [];

        if (criterias !== undefined) {
            if (!isCardComponentFilled(criterias["attractivity"])) {
                errors.push({
                    id: "criterias.attractivity.empty",
                    message: "Marktattraktivität darf nicht leer sein!",
                    level: "error"
                });
            }
            if (isCardComponentTooLong(criterias["attractivity"])) {
                errors.push({
                    id: "criterias.attractivity.too-long",
                    message: "Einige Felder der Markattraktivität sind zu lang!",
                    level: "error"
                });
            }

            if (!isCardComponentFilled(criterias["comp-standing"])) {
                errors.push({
                    id: "criterias.comp.empty",
                    message: "Wettbewerbsposition darf nicht leer sein!",
                    level: "error"
                });
            }
            if (isCardComponentTooLong(criterias["comp-standing"])) {
                errors.push({
                    id: "criterias.comp.too-long",
                    message: "Einige Felder der Wettbewerbspositon sind zu lang!",
                    level: "error"
                });
            }
        }

        return errors;
    }

}