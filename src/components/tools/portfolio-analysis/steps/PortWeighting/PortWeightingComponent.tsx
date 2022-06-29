import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PortfolioAnalysisValues} from "../../PortfolioAnalysis";
import {
    CompareComponent,
    CompareComponentValues
} from "../../../../../general-components/CompareComponent/CompareComponent";
import {MatchCardComponentFieldsAdapter} from "../../../../../general-components/CompareComponent/Adapter/MatchCardComponentFieldsAdapter";
import {PortWeighting} from "./PortWeighting";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";


interface PortWeightingValues {
    "attractivity": CompareComponentValues,
    "comp-standing": CompareComponentValues
}

class PortWeightingComponent extends Step<PortfolioAnalysisValues, {}> {

    public constructor(props: StepProp<PortfolioAnalysisValues>, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<PortfolioAnalysisValues>>, nextState: Readonly<{}>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps, (oldData, newData) => {
            return oldData["port-weighting"] === newData["port-weighting"];
        });
    }

    build(): JSX.Element {
        let criterias = this.props.save.data["port-criterias"];
        let weighting = this.props.save.data["port-weighting"];

        if (weighting !== undefined && criterias !== undefined) {
            const attAdapter = new MatchCardComponentFieldsAdapter(criterias["attractivity"]);
            const compAdapter = new MatchCardComponentFieldsAdapter(criterias["comp-standing"]);

            return (
                <>
                    <h5>Markattraktivität</h5>

                    <CompareComponent
                        name={"attractivity"}
                        header={PortWeighting.header}
                        fields={attAdapter}
                        values={weighting["attractivity"]}
                        disabled={this.props.disabled}
                        onChanged={this.attractivityChanged}
                    />

                    <UIErrorBanner id={"attractivity-weighting.empty"}></UIErrorBanner>

                    <h5>Wettbewerbsposition</h5>

                    <CompareComponent
                        name={"comp-standing"}
                        header={PortWeighting.header}
                        fields={compAdapter}
                        values={weighting["comp-standing"]}
                        disabled={this.props.disabled}
                        onChanged={this.compStandingChanged}
                    />
                    <UIErrorBanner id={"compStanding-weighting.empty"}></UIErrorBanner>
                </>
            );
        }
        return <></>;
    }

    attractivityChanged = (values: CompareComponentValues) => {
        this.props.saveController.onChanged((save) => {
            if (save.data["port-weighting"] !== undefined) {
                save.data["port-weighting"]["attractivity"] = values;
            }
        });
    }

    compStandingChanged = (values: CompareComponentValues) => {
        this.props.saveController.onChanged((save) => {
            if (save.data["port-weighting"] !== undefined) {
                save.data["port-weighting"]["comp-standing"] = values;
            }
        });
    }


}

export {
    PortWeightingComponent
}
export type {
    PortWeightingValues
}