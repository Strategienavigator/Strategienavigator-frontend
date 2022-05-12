import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {ComponentClass, FunctionComponent} from "react";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {PortWeightingComponent} from "./PortWeightingComponent";


export class PortWeighting implements StepDefinition<PortfolioAnalysisValues>, StepDataHandler<PortfolioAnalysisValues> {
    dataHandler: StepDataHandler<PortfolioAnalysisValues>;
    form: FunctionComponent<StepProp<PortfolioAnalysisValues>> | ComponentClass<StepProp<PortfolioAnalysisValues>>;
    id: string;
    title: string;

    constructor() {
        this.dataHandler = this;
        this.form = PortWeightingComponent;
        this.id = "port-weighting";
        this.title = "3. Gewichtung";
    }

    deleteData(data: Draft<PortfolioAnalysisValues>): void {
        data["port-weighting"] = undefined;
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