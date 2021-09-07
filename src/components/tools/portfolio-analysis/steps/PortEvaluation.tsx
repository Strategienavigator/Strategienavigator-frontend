import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";


interface PortEvaluationValues {

}

class PortEvaluation extends FormComponent<PortEvaluationValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): PortEvaluationValues {
        return {};
    }

    onReset(type: ResetType): void {
    }

    prepareValues = async (): Promise<void> => {

    }

    submit = async (values: PortEvaluationValues): Promise<void> => {

    }

    validate(values: PortEvaluationValues): boolean {
        return false;
    }

}

export {
    PortEvaluation
};
export type {PortEvaluationValues};
