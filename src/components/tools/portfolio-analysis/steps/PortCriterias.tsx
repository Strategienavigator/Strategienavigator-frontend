import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


interface PortCriteriasValues {

}

class PortCriterias extends Step<PortCriteriasValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): PortCriteriasValues {
        return {};
    }

    onReset(type: ResetType): void {
    }

    rebuildValues = async (values: PortCriteriasValues) => {

    }

    buildPreviousValues = async (): Promise<void> => {

    }

    submit = async (values: PortCriteriasValues): Promise<void> => {

    }

    validate(values: PortCriteriasValues): boolean {
        return false;
    }

}

export {
    PortCriterias
};
export type {PortCriteriasValues};
