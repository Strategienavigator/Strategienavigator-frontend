import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


interface PortCreateObjectsValues {

}

class PortCreateObjects extends Step<PortCreateObjectsValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): PortCreateObjectsValues {
        return {};
    }

    onReset(type: ResetType): void {
    }

    rebuildValues = async (values: PortCreateObjectsValues) => {

    }

    buildPreviousValues = async (): Promise<void> => {

    }

    submit = async (values: PortCreateObjectsValues): Promise<void> => {

    }

    validate(values: PortCreateObjectsValues): boolean {
        return false;
    }

}

export {
    PortCreateObjects
};
export type {PortCreateObjectsValues};
