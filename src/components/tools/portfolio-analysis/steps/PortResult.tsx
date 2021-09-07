import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";


interface PortResultValues {

}

class PortResult extends FormComponent<PortResultValues, any> {
    build(): JSX.Element {
        return <div/>;
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): PortResultValues {
        return {};
    }

    onReset(type: ResetType): void {
    }

    prepareValues = async (): Promise<void> => {

    }

    submit = async (values: PortResultValues): Promise<void> => {

    }

    validate(values: PortResultValues): boolean {
        return false;
    }

}

export {
    PortResult
};
export type {PortResultValues};
