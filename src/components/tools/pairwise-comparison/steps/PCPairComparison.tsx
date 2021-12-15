import {ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import {FormEvent} from "react";
import {Step} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CompareComponent} from "../../../../general-components/CompareComponent/CompareComponent";
import {CompareNumberHeader} from "../../../../general-components/CompareComponent/Header/CompareNumberHeader";
import {MatchCardComponentFieldsAdapter} from "../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {PCCriteriasValues} from "./PCCriterias";


export interface PCPairComparisonValues {

}

export class PCPairComparison extends Step<PCPairComparisonValues, {}> {

    private criterias: null | PCCriteriasValues | undefined;

    onReset = (type: ResetType) => {

    }

    rebuildValues = async (values: PCPairComparisonValues) => {

    }

    buildPreviousValues = async () => {
        this.criterias = this.props.stepComp?.getPreviousStep<PCCriteriasValues>();
    }

    changeControlFooter(): void {
    }

    build() {
        if (this.criterias) {
            let adapter = new MatchCardComponentFieldsAdapter(this.criterias.criterias);

            return (
                <div>
                    <CompareComponent
                        values={adapter}
                        header={new CompareNumberHeader(3)}
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
        return {};
    }

}
