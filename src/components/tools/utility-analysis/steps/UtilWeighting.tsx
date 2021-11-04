import {ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


interface UtilWeightingValues {

}

class UtilWeighting extends Step<UtilWeightingValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): UtilWeightingValues {
        return {};
    }

    onReset(type: ResetType): void {
    }

    rebuildValues = async (values: UtilWeightingValues) => {

    }

    buildPreviousValues = async (): Promise<void> => {

    }

    submit = async (values: UtilWeightingValues): Promise<void> => {

    }

    validate(values: UtilWeightingValues): boolean {
        return false;
    }

}

export {
    UtilWeighting
};
export type {UtilWeightingValues};
