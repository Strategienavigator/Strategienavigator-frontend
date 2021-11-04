import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


interface UtilInvestigationObjectsValues {

}

class UtilInvestigationObjects extends Step<UtilInvestigationObjectsValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): UtilInvestigationObjectsValues {
        return {};
    }

    onReset(type: ResetType): void {
    }

    rebuildValues = async (values: UtilInvestigationObjectsValues) => {

    }

    buildPreviousValues = async (): Promise<void> => {

    }

    submit = async (values: UtilInvestigationObjectsValues): Promise<void> => {

    }

    validate(values: UtilInvestigationObjectsValues): boolean {
        return false;
    }

}

export {
    UtilInvestigationObjects
};
export type {UtilInvestigationObjectsValues};
