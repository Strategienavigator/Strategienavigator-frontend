import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";


interface UtilWeightingValues {

}

class UtilWeighting extends FormComponent<UtilWeightingValues, any> {
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

    prepareValues = async (): Promise<void> => {

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
