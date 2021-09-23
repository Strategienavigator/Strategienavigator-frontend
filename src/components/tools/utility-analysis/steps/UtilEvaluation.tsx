import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";


interface UtilEvaluationValues {

}

class UtilEvaluation extends FormComponent<UtilEvaluationValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): UtilEvaluationValues {
        return {};
    }

    onReset(type: ResetType): void {
    }

    rebuildValues = async (values: UtilEvaluationValues) => {

    }

    buildPreviousValues = async (): Promise<void> => {

    }

    submit = async (values: UtilEvaluationValues): Promise<void> => {

    }

    validate(values: UtilEvaluationValues): boolean {
        return false;
    }

}

export {
    UtilEvaluation
};
export type {UtilEvaluationValues};
