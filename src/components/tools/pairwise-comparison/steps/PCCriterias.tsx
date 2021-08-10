import FormComponent from "../../../../general-components/Form/FormComponent";
import {FormControl, InputGroup} from "react-bootstrap";
import {FormEvent} from "react";
import {extractFromForm} from "../../../../general-components/FormHelper";

export interface PCCriteriasValues {
    firstname: string
}

export default class PCCriterias extends FormComponent<PCCriteriasValues, {}> {

    prepareValues = async () => {
        this.setValues({
            firstname: "Nichlas"
        });
    }

    build() {
        return (
            <div>
                <InputGroup size={"sm"}>
                    <FormControl disabled={this.disabled} name={"firstname"} defaultValue={this.values?.firstname}
                                 placeholder={"Vorname"}/>
                </InputGroup>
            </div>
        );
    }

    submit = async (values: PCCriteriasValues) => {

    }

    validate(values: PCCriteriasValues): boolean {
        return true;
    }

    extractValues(e: FormEvent<HTMLFormElement>): PCCriteriasValues {
        let firstname: string = extractFromForm(e, "firstname") as string;

        return {
            firstname: firstname
        };
    }

}