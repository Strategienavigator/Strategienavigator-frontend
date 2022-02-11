import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


interface PortEvaluationValues {

}

class PortEvaluation extends Step<PortEvaluationValues, any> {
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

    rebuildValues = async (values: PortEvaluationValues) => {

    }

    buildPreviousValues = async (): Promise<void> => {

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
