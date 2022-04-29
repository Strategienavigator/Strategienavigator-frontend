import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {
    CompareComponent,
    CompareComponentValues
} from "../../../../../general-components/CompareComponent/CompareComponent";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import {UtilEvaluation} from "./UtilEvaluation";
import {LinearCardComponentFieldsAdapter} from "../../../../../general-components/CompareComponent/Adapter/LinearCardComponentFieldsAdapter";
import {Button} from "react-bootstrap";
import {CreateDescriptionModal} from "./CreateDescriptionModal";
import FAE from "../../../../../general-components/Icons/FAE";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";


export interface UtilEvaluationValues {
    evaluation: {
        /**
         * Index vom Kriterium
         */
        criteriaIndex: number,
        /**
         * Array aus indexen zu den Objekten
         */
        objects: number[]
        /**
         * Der Vergleich
         */
        rating: CompareComponentValues
    }[]
}

interface UtilEvaluationComponentState {
    showModal: number
}

class UtilEvaluationComponent extends Step<UtilityAnalysisValues, UtilEvaluationComponentState> {

    public constructor(props: any, context: any) {
        super(props, context);

        this.state = {
            showModal: -1
        }
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<UtilityAnalysisValues>>, nextState: Readonly<UtilEvaluationComponentState>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps,
            (oldData, newData) => (
                oldData["ua-evaluation"] === newData["ua-evaluation"] &&
                oldData["ua-criterias"] === newData["ua-criterias"] &&
                oldData["ua-investigation-obj"] === newData["ua-investigation-obj"]
            )
        ) || this.state.showModal !== nextState.showModal;
    }

    build(): JSX.Element {
        const values = this.props.save.data["ua-evaluation"];
        const investigationObjs = this.props.save.data["ua-investigation-obj"]?.objects;

        const criterias = this.props.save.data["ua-criterias"]?.criterias;

        if (values && investigationObjs && criterias) {
            const adapter = new LinearCardComponentFieldsAdapter(investigationObjs);

            return (
                <>
                    {criterias.map((criteria, criteriaIndex) => {
                        const rating = values.evaluation[criteriaIndex].rating;

                        return (
                            <div className={"comparison criteriaToObject"} key={"criteria-" + criteriaIndex}>
                                <div className={"criteria"}>
                                    {criteria.name}

                                    {(criteria.extra !== undefined) && (
                                        <>
                                            &nbsp;
                                            <Button
                                                onClick={() => {
                                                    this.setState({
                                                        showModal: criteriaIndex
                                                    });
                                                }}
                                                size={"sm"}
                                            >
                                                Skala <FAE icon={faInfoCircle}/>
                                            </Button>
                                        </>
                                    )}
                                </div>

                                {(criteria.extra !== undefined) && (
                                    <CreateDescriptionModal
                                        show={criteriaIndex === this.state.showModal}
                                        values={criteria.extra}
                                        onClose={() => {
                                            this.setState({
                                                showModal: -1
                                            });
                                        }}
                                    />
                                )}

                                <CompareComponent
                                    header={UtilEvaluation.header}
                                    fields={adapter}
                                    values={rating}
                                    disabled={this.props.disabled}
                                    disabledComparisons={criteria.extra?.activeIndices}
                                    name={criteria.name}
                                    onChanged={(values) => {
                                        this.valuesChanged(criteriaIndex, values);
                                    }}
                                />
                            </div>
                        );
                    })}
                    <UIErrorBanner id={"ua-evaluation.empty"}/>
                </>
            );
        }
        return <></>;
    }

    /**
     * Wird aufgerufen, wenn ein Benutzer einen Vergleich auswählt
     *
     * @param {number} index der Index vom Vergleich. Zu welchem Kriterium gehört der Vergleich?
     * @param {CompareComponentValues} values Values vom Vergleich
     */
    valuesChanged(index: number, values: CompareComponentValues) {
        this.props.saveController.onChanged((save) => {
            if (save.data["ua-evaluation"]) {
                save.data["ua-evaluation"].evaluation[index].rating = values;
            }
        });
    }

}

export {
    UtilEvaluationComponent
};
