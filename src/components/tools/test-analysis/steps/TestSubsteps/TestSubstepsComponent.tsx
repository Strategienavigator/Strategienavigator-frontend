import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {TestAnalysisValues} from "../../TestAnalysis";
import {Form, FormGroup, Image} from "react-bootstrap";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";

export interface TestSubstepsValues {
    ratings: number[]
}

interface TestSubstepsComponentState {

}

class TestSubstepsComponent extends Step<TestAnalysisValues, TestSubstepsComponentState> {

    public constructor(props: StepProp<TestAnalysisValues> | Readonly<StepProp<TestAnalysisValues>>) {
        super(props);
    }

    protected build(): JSX.Element {
        let ratings = this.props.save.data["test-substeps"]?.ratings;

        if (ratings) {
            return (
                <>
                    <h3>Bitte bewerten Sie folgendes Bild:</h3>

                    <Image
                        className={"mt-3"}
                        thumbnail
                        rounded
                        src={`https://picsum.photos/600/300?${this.props.currentSubStep}`}
                    />

                    <FormGroup
                        className={"mt-3"}
                    >
                        <Form.Label>
                            Bewertung ({ratings[this.props.currentSubStep]})
                        </Form.Label>

                        <Form.Range
                            min={0}
                            max={10}
                            disabled={this.props.disabled}
                            value={ratings[this.props.currentSubStep]}
                            onChange={(e) => {
                                this.props.saveController.onChanged(save => {
                                    let ratings = save.data["test-substeps"]!.ratings;
                                    ratings[this.props.currentSubStep] = Number(e.target.value);
                                    save.data["test-substeps"]!.ratings = ratings;
                                });
                            }}
                        />

                        <UIErrorBanner id={"rating.empty"}/>
                    </FormGroup>
                </>
            );
        }
        return <></>;
    }

}

export {
    TestSubstepsComponent
}