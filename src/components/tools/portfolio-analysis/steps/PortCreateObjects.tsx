import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";


interface PortCreateObjectsValues {

}

class PortCreateObjects extends FormComponent<PortCreateObjectsValues, any> {
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
