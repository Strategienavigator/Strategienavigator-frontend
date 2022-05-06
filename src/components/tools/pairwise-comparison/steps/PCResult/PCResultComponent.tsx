import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PairwiseComparisonValues} from "../../PairwiseComparison";
import {EvaluationComponent} from "../../../../../general-components/EvaluationComponent/EvaluationComponent";
import {EvaluationValues} from "../../../../../general-components/EvaluationComponent/Evaluation";


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
                <EvaluationComponent customTableHeader={"Kriterium"} values={values}/>
            );
        }

        return <p>ERROR</p>;

    }
}

export {
    PCResultComponent
}