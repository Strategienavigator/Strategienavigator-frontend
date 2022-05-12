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


export class PortCriterias implements StepDefinition<PortfolioAnalysisValues>, StepDataHandler<PortfolioAnalysisValues> {
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

    }

    isUnlocked(data: PortfolioAnalysisValues): boolean {
        return false;
    }


    validateData(data: PortfolioAnalysisValues): UIError[] {
        return [];
    }

}