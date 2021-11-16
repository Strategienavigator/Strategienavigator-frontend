import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {PCCriteriasValues} from "./PCCriterias";
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


export interface PCPairComparisonValues {

}

export class PCPairComparison extends Step<PCPairComparisonValues, {}> {

    onReset = (type: ResetType) => {

    }

    rebuildValues = async (values: PCPairComparisonValues) => {

    }

    buildPreviousValues = async () => {
        let previous = this.props.stepComp?.getPreviousStep<PCCriteriasValues>();
        console.log("STEP 1 Values: ", previous);
    }

    changeControlFooter(): void {
    }

    build() {
        return (
            <div>
                Im Aufbau...
            </div>
        );
    }

    submit = async (values: PCPairComparisonValues) => {
    }

    validate(values: PCPairComparisonValues): boolean {
        return true;
    }

    extractValues(e: FormEvent<HTMLFormElement>): PCPairComparisonValues {
        return {};
    }

}
