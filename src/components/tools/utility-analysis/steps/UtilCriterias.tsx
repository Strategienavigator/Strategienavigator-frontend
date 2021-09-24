import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";


interface UtilCriteriasValues {

}

class UtilCriterias extends FormComponent<UtilCriteriasValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): UtilCriteriasValues {
        return {};
    }

    onReset(type: ResetType): void {
    }

    rebuildValues = async (values: UtilCriteriasValues) => {

    }

    buildPreviousValues = async (): Promise<void> => {

    }

    submit = async (values: UtilCriteriasValues): Promise<void> => {

    }

    validate(values: UtilCriteriasValues): boolean {
        return false;
    }

}

export {
    UtilCriterias
};
export type {UtilCriteriasValues};
