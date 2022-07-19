import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {ComponentClass, FunctionComponent} from "react";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {PortResultComponent} from "./PortResultComponent";
import {Point} from "../../../../../general-components/CoordinateSystem/Point";


export class PortResult implements StepDefinition<PortfolioAnalysisValues>, StepDataHandler<PortfolioAnalysisValues> {
    dataHandler: StepDataHandler<PortfolioAnalysisValues>;
    form: FunctionComponent<StepProp<PortfolioAnalysisValues>> | ComponentClass<StepProp<PortfolioAnalysisValues>>;
    id: string;
    title: string;

    constructor() {
        this.dataHandler = this;
        this.form = PortResultComponent;
        this.id = "port-result";
        this.title = "5. Ergebnismatrix";
    }

    deleteData(data: Draft<PortfolioAnalysisValues>): void {
        data["port-result"] = undefined;
    }

    fillFromPreviousValues(data: Draft<PortfolioAnalysisValues>): void {
        let objects = data["port-objects"];
        let points: Point[] = [];

        if (objects !== undefined) {
            points = [
                new Point(1.1, 6, objects.objects[0].name, 1),
                new Point(0.3, 8, objects.objects[1].name, 1.3),
                new Point(0.4, 1, objects.objects[2].name, 2)
            ];
        }

        data["port-result"] = {
            results: {},
            points: points
        };
    }

    isUnlocked(data: PortfolioAnalysisValues): boolean {
        return data["port-result"] !== undefined;
    }

    validateData(data: PortfolioAnalysisValues): UIError[] {
        return [];
    }

}