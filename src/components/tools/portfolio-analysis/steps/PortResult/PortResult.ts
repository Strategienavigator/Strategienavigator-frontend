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
import {Point, PointColors} from "../../../../../general-components/CoordinateSystem/Point/Point";
import {ResultEvaluation} from "../../../../../general-components/EvaluationComponent/Result/ResultEvaluation";
import {PortEvaluation} from "../PortEvaluation/PortEvaluation";


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
        if (data["port-criterias"] !== undefined && data["port-objects"] !== undefined && data["port-weighting"] !== undefined && data["port-evaluation"] !== undefined) {
            let objects = data["port-objects"].objects;

            // Attractivity
            let aCriterias = data["port-criterias"].attractivity;
            let aWeighting = data["port-weighting"].attractivity;
            let aEvaluation = data["port-evaluation"].attractivity.map(item => item.rating);

            let aResultEvaluation = ResultEvaluation.from(aCriterias, objects, aWeighting, aEvaluation, PortEvaluation.header);
            let aResult = aResultEvaluation.getResult();

            // Standing
            let sCriterias = data["port-criterias"]["comp-standing"];
            let sWeighting = data["port-weighting"]["comp-standing"];
            let sEvaluation = data["port-evaluation"]["comp-standing"].map(item => item.rating);

            let sResultEvaluation = ResultEvaluation.from(sCriterias, objects, sWeighting, sEvaluation, PortEvaluation.header);
            let sResult = sResultEvaluation.getResult();

            let points: Point[] = [];

            let sumS = sResult.result.reduce((p, n) => p + n.points, 0);
            let sumA = aResult.result.reduce((p, n) => p + n.points, 0);

            for (let i = 0; i < objects.length; i++) {
                let object = objects[i];

                let y = aResult.result[i].points;
                let x = sResult.result[i].points;
                let sumRelative = (x / sumS) + (y / sumA);
                let sizeMultiplier = Math.pow((0.6 + sumRelative), 1.7);
                // sizeMultiplier = 1.0;

                let point = new Point(x, y, object.name, sizeMultiplier, PointColors[i]);
                points.push(point);
            }

            data["port-result"] = {
                results: {
                    attractivity: aResult,
                    "comp-standing": sResult
                },
                points: points
            };
        }
    }

    isUnlocked(data: PortfolioAnalysisValues): boolean {
        return data["port-result"] !== undefined;
    }

    validateData(data: PortfolioAnalysisValues): UIError[] {
        return [];
    }

}