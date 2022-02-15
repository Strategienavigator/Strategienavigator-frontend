import {FormComponentProps, ResetType} from "../../../../../general-components/Tool/FormComponent/FormComponent";
import React, {FormEvent} from "react";
import {Step, SteppableProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {extractCardComponentField} from "../../../../../general-components/FormHelper";
import {UACriteriaCustomDescription, UACriteriaCustomDescriptionValues} from "./UACriteriaCustomDescription";
import {CompareSymbolHeader} from "../../../../../general-components/CompareComponent/Header/CompareSymbolHeader";
import {CustomDescriptionComponent} from "../../../../../general-components/CardComponent/CustomDescriptionComponent/CustomDescriptionComponent";


export interface UtilCriteriasValues {
    criterias: CardComponentFields<UACriteriaCustomDescriptionValues>
}

class UtilCriterias extends Step<UtilCriteriasValues, any> {
    private readonly header: CompareSymbolHeader;
    private readonly customDesc: React.RefObject<UACriteriaCustomDescription>;

    constructor(props: (FormComponentProps & SteppableProp) | Readonly<FormComponentProps & SteppableProp>) {
        super(props);

        this.header = new CompareSymbolHeader(["--", "-", "0", "+", "++"]);
        this.customDesc = React.createRef<UACriteriaCustomDescription>();
    }


    build(): JSX.Element {
        return (
            <CardComponent<UACriteriaCustomDescriptionValues>
                customDescription={<UACriteriaCustomDescription ref={this.customDesc} header={this.header}/>}
                values={(this.values as UtilCriteriasValues).criterias}
                name={"util-criterias"}
                disabled={this.disabled}
                min={2}
                max={10}
            />
        );
    }

    changeControlFooter(): void {
    }

    extractValues(e: FormEvent<HTMLFormElement>): UtilCriteriasValues {
        let criterias = extractCardComponentField<UACriteriaCustomDescriptionValues>(
            e,
            "util-criterias",
            this.customDesc.current as CustomDescriptionComponent<UACriteriaCustomDescriptionValues, any, any>
        ) as CardComponentFields<UACriteriaCustomDescriptionValues>;

        return {
            criterias: criterias
        };
    }

    onReset(type: ResetType): void {
    }

    rebuildValues = async (values: UtilCriteriasValues) => {
    }

    buildPreviousValues = async (): Promise<void> => {
    }

    submit = async (values: UtilCriteriasValues): Promise<void> => {
    }

    validate(values: UtilCriteriasValues): boolean {
        return true;
    }

}

export {
    UtilCriterias
};
