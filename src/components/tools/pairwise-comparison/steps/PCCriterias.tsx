import {
    FormComponent,
    FormComponentProps,
    ResetType
} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {extractCardComponentField} from "../../../../general-components/FormHelper";
import {CardComponent, CardComponentFields} from "../../../../general-components/CardComponent/CardComponent";
import {Messages} from "../../../../general-components/Messages/Messages";
import {Step, SteppableProp} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


/**
 * Die Werte des ersten Schrittes des Paarweisen-Vergleiches
 */
export interface PCCriteriasValues {
    criterias: CardComponentFields
}

/**
 * Baut den ersten Schritt des Paarweisen-Vergleiches
 * hier werden, mithilfe des CardComponents, Kriterien angesammelt
 */
export class PCCriterias extends Step<PCCriteriasValues, {}> {

    rebuildValues = async (values: PCCriteriasValues) => {

    }

    buildPreviousValues = async () => {
    }

    changeControlFooter(): void {
    }

    onReset = (type: ResetType) => {

    }

    /**
     * Gibt ein CardComponent aus um die Kriterien anzusammeln
     *
     * @returns {JSX.Element} CardComponent
     */
    build() {
        let values = this.values as PCCriteriasValues;

        return (
            <CardComponent
                name={"criterias"}
                disabled={this.disabled}
                values={values.criterias}
                min={2}
                max={10}
            />
        );
    }

    submit = async (values: PCCriteriasValues) => {
    }

    /**
     * Methode zum validieren der Werte
     * Es müssen mindestens 2 Kriterien angegeben werden damit true zurückgegeben wird
     *
     * @param {PCCriteriasValues} values
     * @returns {boolean}
     */
    validate(values: PCCriteriasValues): boolean {
        if (values.criterias.length < 2) {
            Messages.add("Sie müssen mindestens 2 Kriterien samt Beschreibung angeben, um fortfahren zu können.", "DANGER", Messages.TIMER);
            return false;
        }

        return true;
    }

    /**
     * Extrahiert die Werte aus dem übermittelten HTMLFormElement
     * Mittels diesen werten wird ein Objekt vom Typ PCCriteriasValues gebaut und ausgegeben
     *
     * @param {React.FormEvent<HTMLFormElement>} e Das HTMLFormElement mit allen Werten vom Benutzer
     * @returns {PCCriteriasValues} Objekt vom Typ PCCriteriasValues
     */
    extractValues(e: FormEvent<HTMLFormElement>): PCCriteriasValues {
        let criterias: CardComponentFields = extractCardComponentField(e, "criterias") as CardComponentFields;

        return {
            criterias: criterias
        };
    }

}
