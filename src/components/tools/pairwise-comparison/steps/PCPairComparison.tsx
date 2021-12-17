import {ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CompareComponent} from "../../../../general-components/CompareComponent/CompareComponent";
import {CompareNumberHeader} from "../../../../general-components/CompareComponent/Header/CompareNumberHeader";
import {MatchCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {PCCriteriasValues} from "./PCCriterias";
import {extractFromForm} from "../../../../general-components/FormHelper";


export interface PCPairComparisonValues {
    comparisons: {
        value: string | null,
        header: string | null
    }[],
    headers: string[]
}

export class PCPairComparison extends Step<PCPairComparisonValues, {}> {
    private header = new CompareNumberHeader(0, 3);
    private adapter: MatchCardComponentFieldsAdapter | undefined;
    private criterias: null | PCCriteriasValues | undefined;

    onReset = (type: ResetType) => {
        console.log(this.values);
    }

    rebuildValues = async (values: PCPairComparisonValues) => {
        this.criterias = this.props.stepComp?.getFormValues<PCCriteriasValues>("pc-criterias");
    }

    buildPreviousValues = async () => {
        this.criterias = this.props.stepComp?.getFormValues<PCCriteriasValues>("pc-criterias");
    }

    changeControlFooter(): void {
    }

    build() {
        let values = this.values as PCPairComparisonValues;

        if (this.criterias && this.criterias.criterias) {
            this.adapter = new MatchCardComponentFieldsAdapter(this.criterias.criterias);

            return (
                <div>
                    <CompareComponent
                        values={values.comparisons}
                        showHeader={true}
                        fields={this.adapter}
                        header={this.header}
                    />
                </div>
            );
        }
        return <></>;
    }

    submit = async (values: PCPairComparisonValues) => {
    }

    validate(values: PCPairComparisonValues): boolean {
        return true;
    }

    extractValues(e: FormEvent<HTMLFormElement>): PCPairComparisonValues {
        let comparisons: PCPairComparisonValues = {
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

            // headers
            comparisons.headers = this.header.getHeaders();
        }

        return comparisons;
    }

}
