import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";


interface PortWeightingValues {

}

class PortWeighting extends FormComponent<PortWeightingValues, any> {
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

    prepareValues = async (): Promise<void> => {

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
