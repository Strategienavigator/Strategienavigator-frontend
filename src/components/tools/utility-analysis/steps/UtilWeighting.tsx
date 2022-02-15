import {ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CompareNumberHeader} from "../../../../general-components/CompareComponent/Header/CompareNumberHeader";
import {CompareComponent} from "../../../../general-components/CompareComponent/CompareComponent";
import {MatchCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {UtilCriteriasValues} from "./criterias/UtilCriterias";
import {extractFromForm} from "../../../../general-components/FormHelper";


export interface UtilWeightingValues {
 comparisons: {
     value: string | null,
     header: string | null
 }[],
    headers: string[]
}

class UtilWeighting extends Step<UtilWeightingValues, any> {
    private header = new CompareNumberHeader(0, 3);
    private adapter: MatchCardComponentFieldsAdapter | undefined;
    private utilCriterias: null | UtilCriteriasValues | undefined;

    build(): JSX.Element {
        let values = this.values as UtilWeightingValues;

        if(this.utilCriterias && this.utilCriterias.criterias) {
            this.adapter = new MatchCardComponentFieldsAdapter(this.utilCriterias.criterias);

            return (
                <CompareComponent
                    values={values.comparisons}
                    showHeader={true}
                    fields={this.adapter}
                    header={this.header}
                />
            );
        }
        return <></>;
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): UtilWeightingValues {
        let comparisons: UtilWeightingValues = {
            comparisons: [],
            headers: []
        };

        if (this.adapter) {
            let length = this.adapter.getLength();

            for (let i = 0; i < length; i++) {
                let radioNodeList = extractFromForm(e, "field-" + i) as RadioNodeList;
                let header, value = null;
                if (radioNodeList !== null) {
                    if (radioNodeList.value !== "") {
                        value = radioNodeList.value;
                        try {
                            header = this.header.getHeader(parseInt(radioNodeList.value));
                        }
                        catch (e) {

                        }
                    }
                }

                comparisons.comparisons.push({
                    value: value,
                    header: (header !== undefined) ? header : null,
                });
            }
            comparisons.headers = this.header.getHeaders();
        }

        return comparisons;
    }

    onReset(type: ResetType): void {
    }

    rebuildValues = async (values: UtilWeightingValues) => {
        this.utilCriterias = this.props.stepComp?.getFormValues<UtilCriteriasValues>("ua-criterias");
    }

    buildPreviousValues = async (): Promise<void> => {
        this.utilCriterias = this.props.stepComp?.getFormValues<UtilCriteriasValues>("ua-criterias");
    }

    submit = async (values: UtilWeightingValues): Promise<void> => {

    }

    validate(values: UtilWeightingValues): boolean {
        return true;
    }

}

export {
    UtilWeighting
};
