import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PairwiseComparisonValues} from "../../PairwiseComparison";
import {WeightingEvaluationComponent} from "../../../../../general-components/EvaluationComponent/Weighting/WeightingEvaluationComponent";
import {EvaluationValues} from "../../../../../general-components/EvaluationComponent/Weighting/WeightingEvaluation";


export interface PCResultValues extends EvaluationValues {
}

class PCResultComponent extends Step<PairwiseComparisonValues, {}> {

    public constructor(props: Readonly<StepProp<PairwiseComparisonValues>> | StepProp<PairwiseComparisonValues>, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<PairwiseComparisonValues>>, nextState: Readonly<{}>, nextContext: any): boolean {
        let shouldUpdate = !shallowCompareStepProps(this.props, nextProps);
        if (!shouldUpdate) {
            shouldUpdate = this.props.save.data["pc-result"] !== nextProps.save.data["pc-result"];
        }

        return shouldUpdate;
    }

    build(): JSX.Element {
        let values = this.props.save.data["pc-result"];

        if (values !== undefined) {
            return (
                <WeightingEvaluationComponent customTableHeader={"Kriterium"} values={values}/>
            );
        }

        return <p>ERROR</p>;

    }
}

export {
    PCResultComponent
}