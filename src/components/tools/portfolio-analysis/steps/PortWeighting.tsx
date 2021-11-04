import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


interface PortWeightingValues {

}

class PortWeighting extends Step<PortWeightingValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): PortWeightingValues {
        return {};
    }

    onReset(type: ResetType): void {
    }

    buildPreviousValues = async (): Promise<void> => {

    }

    rebuildValues = async (values: PortWeightingValues) => {

    }

    submit = async (values: PortWeightingValues): Promise<void> => {

    }

    validate(values: PortWeightingValues): boolean {
        return false;
    }

}

export {
    PortWeighting
};
export type {PortWeightingValues};
