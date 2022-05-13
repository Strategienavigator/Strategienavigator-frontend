import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {PortObjects} from "./PortObjects";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import {PortObjectsCustomDescription, PortObjectsCustomDescriptionValues} from "./PortObjectsCustomDescription";


interface PortCreateObjectsValues {
    objects: CardComponentFields<PortObjectsCustomDescriptionValues>
}

class PortObjectsComponent extends Step<PortfolioAnalysisValues, any> {

    public constructor(props: Readonly<StepProp<PortfolioAnalysisValues>> | StepProp<PortfolioAnalysisValues>, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<PortfolioAnalysisValues>>, nextState: Readonly<{}>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps, (oldData, newData) => {
            return oldData["port-objects"] === newData["port-objects"];
        });
    }

    build(): JSX.Element {
        let values = this.props.save.data["port-objects"];

        if (values !== undefined) {
            return (
                <>
                    <CardComponent<PortObjectsCustomDescriptionValues>
                        name={"port-objects"}
                        customDescription={PortObjectsCustomDescription}
                        customDescValuesFactory={PortObjects.getDefaultExtraValues}
                        values={values.objects}
                        disabled={this.props.disabled}
                        min={PortObjects.min}
                        max={PortObjects.max}
                        onChanged={this.valuesChanged}
                    />

                    <UIErrorBanner id={"port-objects.empty"} />
                    <UIErrorBanner id={"port-objects.too-long"} />
                    <UIErrorBanner id={"port-objects.q&q"} />
                </>
            );
        }
        return <></>;
    }

    valuesChanged = (fields: CardComponentFields<PortObjectsCustomDescriptionValues>) => {
        this.props.saveController.onChanged((save) => {
            if (save.data["port-objects"] !== undefined) {
                save.data["port-objects"].objects = fields;
            }
        })
    }

}

export {
    PortObjectsComponent
}
export type {
    PortCreateObjectsValues
}
