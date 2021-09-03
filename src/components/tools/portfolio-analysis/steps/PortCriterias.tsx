import {FormComponent, ResetType} from "../../../../general-components/Form/FormComponent";
import {FormEvent} from "react";


interface PortCriteriasValues {

}

class PortCriterias extends FormComponent<PortCriteriasValues, any> {
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

    prepareValues = async (): Promise<void> => {

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
