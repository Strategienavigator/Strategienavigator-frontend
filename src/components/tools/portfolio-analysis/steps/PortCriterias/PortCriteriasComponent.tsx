import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {PortCriterias} from "./PortCriterias";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import React from "react";
import {
    UACriteriaCustomDescription,
    UACriteriaCustomDescriptionValues
} from "../../../utility-analysis/steps/UtilCriterias/UACriteriaCustomDescription";


interface PortCriteriasValues {
    "attractivity": CardComponentFields<UACriteriaCustomDescriptionValues>,
    "comp-standing": CardComponentFields<UACriteriaCustomDescriptionValues>
}

class PortCriteriasComponent extends Step<PortfolioAnalysisValues, {}> {

    public constructor(props: StepProp<PortfolioAnalysisValues>, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<PortfolioAnalysisValues>>, nextState: Readonly<{}>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps, (oldData, newData) => {
            return oldData["port-criterias"] === newData["port-criterias"];
        });
    }

    build(): JSX.Element {
        let criterias = this.props.save.data["port-criterias"];

        if (criterias !== undefined) {
            return (
                <>
                    <h5>Marktattraktivität</h5>

                    <CardComponent<UACriteriaCustomDescriptionValues>
                        name={"attractivity"}
                        values={criterias["attractivity"]}
                        customDescriptions={[UACriteriaCustomDescription]}
                        customDescValuesFactory={PortCriterias.getDefaultExtraData}
                        disabled={this.props.disabled}
                        min={PortCriterias.MIN}
                        max={PortCriterias.MAX}
                        onChanged={this.attractivityChanged}
                    />
                    <UIErrorBanner id={"criterias.attractivity.too-long"}/>
                    <UIErrorBanner id={"criterias.attractivity.empty"}/>

                    <h5>Wettbewerbsposition</h5>

                    <CardComponent<UACriteriaCustomDescriptionValues>
                        name={"comp-standing"}
                        values={criterias["comp-standing"]}
                        customDescriptions={[UACriteriaCustomDescription]}
                        customDescValuesFactory={PortCriterias.getDefaultExtraData}
                        disabled={this.props.disabled}
                        min={PortCriterias.MIN}
                        max={PortCriterias.MAX}
                        onChanged={this.compStandingChanged}
                    />
                    <UIErrorBanner id={"criterias.comp.too-long"}/>
                    <UIErrorBanner id={"criterias.comp.empty"}/>
                </>
            );
        }
        return <></>;
    }

    attractivityChanged = (values: CardComponentFields) => {
        this.props.saveController.onChanged((save) => {
            if (save.data["port-criterias"] !== undefined) {
                save.data["port-criterias"]["attractivity"] = values;
            }
        });
    }

    compStandingChanged = (values: CardComponentFields) => {
        this.props.saveController.onChanged((save) => {
            if (save.data["port-criterias"] !== undefined) {
                save.data["port-criterias"]["comp-standing"] = values;
            }
        });
    }

}

export {
    PortCriteriasComponent
}
export type {
    PortCriteriasValues
}