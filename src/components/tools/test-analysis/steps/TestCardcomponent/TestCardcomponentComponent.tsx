import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {TestAnalysisValues} from "../../TestAnalysis";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import {MyCustomDescription, MyCustomDescriptionValues} from "./CustomDescription/MyCustomDescription";

export interface TestCardcomponentValues {
    cards: CardComponentFields
}

interface TestCardcomponentComponentState {
}

class TestCardcomponentComponent extends Step<TestAnalysisValues, TestCardcomponentComponentState> {

    public constructor(props: StepProp<TestAnalysisValues> | Readonly<StepProp<TestAnalysisValues>>) {
        super(props);
    }

    protected build(): JSX.Element {
        let cards = this.props.save.data["test-cardcomponent"]?.cards;

        if (cards) {
            return (
                <>
                    <CardComponent<MyCustomDescriptionValues>
                        name={"Test"}
                        values={cards}
                        disabled={false}
                        required={true}
                        customDescriptions={[MyCustomDescription]}
                        customDescValuesFactory={() => {
                            return {
                                rating: 0
                            };
                        }}
                        min={0}
                        max={5}
                        onChanged={(cards) => {
                            this.props.saveController.onChanged(save => {
                                if (save.data["test-cardcomponent"]) {
                                    save.data["test-cardcomponent"].cards = cards;
                                }
                            });
                        }}
                    />

                    <UIErrorBanner id={"empty"}/>
                    <UIErrorBanner id={"toolong"}/>
                </>
            );
        }
        return <></>;
    }

}

export {
    TestCardcomponentComponent
}