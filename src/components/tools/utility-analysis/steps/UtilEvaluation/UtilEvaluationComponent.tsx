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

class UtilEvaluationComponent extends Step<UtilityAnalysisValues, {}> {

    public constructor(props: any, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<UtilityAnalysisValues>>, nextState: Readonly<{}>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps,
            (oldData, newData) => (
                oldData["ua-evaluation"] === newData["ua-evaluation"] &&
                oldData["ua-criterias"] === newData["ua-criterias"] &&
                oldData["ua-investigation-obj"] === newData["ua-investigation-obj"]
            )
        );
    }

    build(): JSX.Element {
        const values = this.props.save.data["ua-evaluation"];
        const investigationObjs = this.props.save.data["ua-investigation-obj"]?.objects;

        const criterias = this.props.save.data["ua-criterias"]?.criterias;

        if(values && investigationObjs && criterias) {
            const adapter = new LinearCardComponentFieldsAdapter(investigationObjs);

            return (
                <>
                    {criterias.map((criteria, criteriaIndex) => {
                        const rating = values.evaluation[criteriaIndex].rating;

                        return (
                          <div className={"comparison criteriaToObject"} key={"criteria-" + criteriaIndex}>
                              <span className={"criteria"}>{criteria.name}</span>

                              <CompareComponent
                                  header={UtilEvaluation.header}
                                  fields={adapter}
                                  values={rating}
                                  disabled={this.props.disabled}
                                  name={criteria.name}
                                  onChanged={(values) => {
                                      this.valuesChanged(criteriaIndex, values);
                                  }}
                              />
                          </div>
                        );
                    })}
                    <UIErrorBanner id={"ua-evaluation.empty"} />
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
