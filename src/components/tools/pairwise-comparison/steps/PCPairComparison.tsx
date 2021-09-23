import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {PCCriteriasValues} from "./PCCriterias";


export interface PCPairComparisonValues {

}

export class PCPairComparison extends FormComponent<PCPairComparisonValues, {}> {

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
