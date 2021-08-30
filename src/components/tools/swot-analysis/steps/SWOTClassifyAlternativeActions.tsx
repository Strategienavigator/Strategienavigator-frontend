import {FormComponent} from "../../../../general-components/Form/FormComponent";
import {FormEvent} from "react";


class SWOTClassifyAlternativeActions extends FormComponent<any, any> {
    build(): JSX.Element {
        return <></>;
    }

    extractValues(e: FormEvent<HTMLFormElement>): any {
    }

    prepareValues = async () => {
        let values = this.props.stepComp?.getPreviousStep();
        console.log(values?.getValues());
    }

    submit = async (values: any) => {
    }

    validate(values: any): boolean {
        return false;
    }

    changeControlFooter(): void {
    }

}

export {
    SWOTClassifyAlternativeActions
}
