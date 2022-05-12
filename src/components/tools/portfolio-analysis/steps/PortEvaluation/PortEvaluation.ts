import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {ComponentClass, FunctionComponent} from "react";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {PortEvaluationComponent} from "./PortEvaluationComponent";


export class PortEvaluation implements StepDefinition<PortfolioAnalysisValues>, StepDataHandler<PortfolioAnalysisValues> {
    dataHandler: StepDataHandler<PortfolioAnalysisValues>;
    form: FunctionComponent<StepProp<PortfolioAnalysisValues>> | ComponentClass<StepProp<PortfolioAnalysisValues>>;
    id: string;
    title: string;

    constructor() {
        this.dataHandler = this;
        this.form = PortEvaluationComponent;
        this.id = "port-evaluation";
        this.title = "4. Bewertung";
    }

    deleteData(data: Draft<PortfolioAnalysisValues>): void {
        data["port-evaluation"] = undefined;
    }

    fillFromPreviousValues(data: Draft<PortfolioAnalysisValues>): void {
    }

    isUnlocked(data: PortfolioAnalysisValues): boolean {
        return false;
    }


    validateData(data: PortfolioAnalysisValues): UIError[] {
        return [];
    }

}