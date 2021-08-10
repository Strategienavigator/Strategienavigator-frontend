import FormComponent from "../../../../general-components/Form/FormComponent";
import {FormControl, InputGroup} from "react-bootstrap";
import {FormEvent} from "react";
import {extractFromForm} from "../../../../general-components/FormHelper";

export interface PCPairComparisonValues {
    firstname: string
    lastname: string
}

export default class PCPairComparison extends FormComponent<PCPairComparisonValues, {}> {

    prepareValues = async () => {
        let previous = this.props.stepComp?.getPreviousStep()?.getValues();

        this.setValues({
            firstname: previous?.firstname,
            lastname: ""
        });
    }

    build() {
        return (
            <div>
                <InputGroup size={"sm"}>
                    <FormControl name={"firstname"} defaultValue={this.values?.firstname} placeholder={"Vorname"}/>
                </InputGroup>

                <InputGroup size={"sm"}>
                    <FormControl name={"lastname"} defaultValue={this.values?.lastname} placeholder={"Nachname"}/>
                </InputGroup>
            </div>
        );
    }

    submit = async (values: PCPairComparisonValues) => {
    }

    validate(values: PCPairComparisonValues): boolean {
        return values.firstname.length > 0 && values.lastname.length > 0;
    }

    extractValues(e: FormEvent<HTMLFormElement>): PCPairComparisonValues {
        let firstname: string = extractFromForm(e, "firstname") as string;
        let lastname: string = extractFromForm(e, "lastname") as string;

        return {
            firstname: firstname,
            lastname: lastname
        };
    }

}