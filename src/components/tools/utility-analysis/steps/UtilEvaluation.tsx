import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


interface UtilEvaluationValues {

}

class UtilEvaluation extends Step<UtilEvaluationValues, any> {
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
