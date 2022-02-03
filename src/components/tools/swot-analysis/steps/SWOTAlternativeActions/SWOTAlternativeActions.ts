import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {SWOTAnalysisValues} from "../../SWOTAnalysis";
import {
    AlternateAction,
    SWOTAlternativeActionsComponent,
    SWOTAlternativeActionsValues
} from "./SWOTAlternativeActionsComponent";
import {SteppableProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {SWOTAnalysisMatrix} from "../../matrix/SWOTAnalysisMatrix";
import {MatrixComponentProps} from "../../../../../general-components/Tool/MatrixComponent/MatrixComponent";
import {SwotFactorsValues} from "../SWOTFactors/SWOTFactorsComponent";
import React from "react";
import {CardComponent} from "../../../../../general-components/CardComponent/CardComponent";

export class SWOTAlternativeActions implements StepDefinition<SWOTAnalysisValues>, StepDataHandler<SWOTAnalysisValues> {
    form: React.FunctionComponent<SteppableProp<SWOTAnalysisValues>> | React.ComponentClass<SteppableProp<SWOTAnalysisValues>>;
    id: string;
    title: string;
    matrix: React.FunctionComponent<MatrixComponentProps<SWOTAnalysisValues>> | React.ComponentClass<MatrixComponentProps<SWOTAnalysisValues>>;
    dataHandler: StepDataHandler<SWOTAnalysisValues>;


    constructor() {
        this.id = "alternative-actions";
        this.title = "2. Handlungsalternativen festlegen";
        this.form = SWOTAlternativeActionsComponent;
        this.matrix = SWOTAnalysisMatrix;
        this.dataHandler = this;
    }

    isUnlocked(data: SWOTAnalysisValues): boolean {
        return (data["alternative-actions"]?.actions.length ?? 0) > 0;
    }

    fillFromPreviousValues(data: SWOTAnalysisValues): SWOTAnalysisValues {
        let analysisValues = data["alternative-actions"];
        if (analysisValues === undefined) {
            analysisValues = {actions: []};
        }

        let previousValues = data["swot-factors"];

        let factors = previousValues?.factors;

        if (factors !== undefined) {
            let strengths = factors.strengths;
            let weaknesses = factors.weaknesses;
            let chances = factors.chances;
            let risks = factors.risks;

            for (const item1 of strengths.concat(weaknesses)) {
                for (const item2 of chances.concat(risks)) {
                    analysisValues.actions.push({
                        name: item1.id + "-" + item2.id,
                        first: item1,
                        second: item2,
                        hasNone: false,
                        alternatives: []
                    });
                    let ref = React.createRef<CardComponent>();
                }
            }
        }
        data["alternative-actions"] = analysisValues
        return data;
    }

    deleteData(data: SWOTAnalysisValues): SWOTAnalysisValues {
        data["alternative-actions"] = undefined;
        return data;
    }


}
