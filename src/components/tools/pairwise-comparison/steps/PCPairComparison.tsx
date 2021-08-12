import FormComponent from "../../../../general-components/Form/FormComponent";
import {FormEvent} from "react";
import {PCCriteriasValues} from "./PCCriterias";

export interface PCPairComparisonValues {

}

export default class PCPairComparison extends FormComponent<PCPairComparisonValues, {}> {

    prepareValues = async () => {
        let previous = this.props.stepComp?.getPreviousStep()?.getValues() as PCCriteriasValues;
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