import {ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CardComponent, CardComponentFields} from "../../../../general-components/CardComponent/CardComponent";
import {extractCardComponentField} from "../../../../general-components/FormHelper";


export interface UtilInvestigationObjectsValues {
    objects: CardComponentFields
}

class UtilInvestigationObjects extends Step<UtilInvestigationObjectsValues, any> {
    build(): JSX.Element {
        let values = this.values as UtilInvestigationObjectsValues;

        return (
            <CardComponent values={values.objects} name={"investigation-objects"} disabled={this.disabled} min={2} max={10} />
        );
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): UtilInvestigationObjectsValues {
        let investigationObjects: CardComponentFields = extractCardComponentField(e, "investigation-objects") as CardComponentFields;

        return {
            objects: investigationObjects
        };
    }

    onReset(type: ResetType): void {
    }

    rebuildValues = async (values: UtilInvestigationObjectsValues) => {

    }

    buildPreviousValues = async (): Promise<void> => {

    }

    submit = async (values: UtilInvestigationObjectsValues): Promise<void> => {

    }

    validate(values: UtilInvestigationObjectsValues): boolean {
        return true;
    }

}

export {
    UtilInvestigationObjects
};
