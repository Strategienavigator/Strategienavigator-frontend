import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {CardComponentField} from "../../../../../general-components/CardComponent/CardComponent";
import {
    ResultEvaluationComponent
} from "../../../../../general-components/EvaluationComponent/Result/ResultEvaluationComponent";


export interface UtilResultValues {
    percentages: {
        criteria: CardComponentField,
        points: number,
        percentage: number
    }[],
    result: {
        object: CardComponentField,
        points: number,
        rank: number
    }[]
}

class UtilResultComponent extends Step<UtilityAnalysisValues, any> {

    public constructor(props: StepProp<UtilityAnalysisValues>) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<UtilityAnalysisValues>>, nextState: Readonly<any>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps,
            (oldData, newData) => (
                oldData["ua-result"] === newData["ua-result"]
            )
        );
    }

    build(): JSX.Element {
        let data = this.props.save.data["ua-result"];

        if (data) {
            return (
                <ResultEvaluationComponent values={data}/>
            );
        }
        return <div>ERROR</div>;
    }

}

export {
    UtilResultComponent
};
