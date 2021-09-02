import {FormComponent, ResetType} from "../../../../general-components/Form/FormComponent";
import {FormEvent} from "react";
import {extractCardComponentField} from "../../../../general-components/FormHelper";
import {CardComponent, CardComponentFields} from "../../../../general-components/CardComponent/CardComponent";
import {Messages} from "../../../../general-components/Messages/Messages";

export interface PCCriteriasValues {
    criterias: CardComponentFields
}

export class PCCriterias extends FormComponent<PCCriteriasValues, {}> {

    prepareValues = async () => {
    }

    changeControlFooter(): void {
    }

    onReset = (type: ResetType) => {

    }

    build() {
        return (
            <div>
                <CardComponent
                    name={"criterias"}
                    disabled={this.disabled}
                    min={2}
                    max={10}
                />
            </div>
        );
    }

    submit = async (values: PCCriteriasValues) => {
    }

    validate(values: PCCriteriasValues): boolean {
        if (values.criterias.length < 2) {
            Messages.add("Sie müssen mindestens 2 Kriterien sammt Beschreibung angeben, um fortfahren zu können.", "DANGER", Messages.TIMER);
            return false;
        }

        return true;
    }

    extractValues(e: FormEvent<HTMLFormElement>): PCCriteriasValues {
        let criterias: CardComponentFields = extractCardComponentField(e, "criterias") as CardComponentFields;

        return {
            criterias: criterias
        };
    }

}
