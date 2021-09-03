import {FormComponent, ResetType} from "../../../../general-components/Form/FormComponent";
import {FormEvent} from "react";


interface UtilResultValues {

}

class UtilResult extends FormComponent<UtilResultValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): UtilResultValues {
        return {};
    }

    onReset(type: ResetType): void {
    }

    prepareValues = async (): Promise<void> => {

    }

    submit = async (values: UtilResultValues): Promise<void> => {

    }

    validate(values: UtilResultValues): boolean {
        return false;
    }

}

export {
    UtilResult
};
export type {UtilResultValues};
