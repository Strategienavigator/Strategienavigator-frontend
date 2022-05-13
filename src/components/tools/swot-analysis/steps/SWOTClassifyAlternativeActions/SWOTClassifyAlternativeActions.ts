import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {SWOTAnalysisValues} from "../../SWOTAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {
    ClassifiedAlternateAction,
    SWOTClassifyAlternativeActionsComponent
} from "./SWOTClassifyAlternativeActionsComponent";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";


export class SWOTClassifyAlternativeActions implements StepDefinition<SWOTAnalysisValues>, StepDataHandler<SWOTAnalysisValues> {

    public static maxClassifications = 10;


    form: React.FunctionComponent<StepProp<SWOTAnalysisValues>> | React.ComponentClass<StepProp<SWOTAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<SWOTAnalysisValues>;


    constructor() {
        this.id = "swot-classify-alternate-actions";
        this.title = "3. Handlungsalternativen klassifizieren";
        this.form = SWOTClassifyAlternativeActionsComponent;
        this.dataHandler = this;
    }

    public static compareClassifiedAlternateActions(action1: ClassifiedAlternateAction, action2: ClassifiedAlternateAction) {
        return action1.indexName.localeCompare(action2.indexName);
    }

    isUnlocked(data: SWOTAnalysisValues): boolean {
        return (data["swot-classify-alternate-actions"]?.actions.length ?? 0) > 0;
    }

    deleteData(data: SWOTAnalysisValues): SWOTAnalysisValues {
        data["swot-classify-alternate-actions"] = undefined
        return data;
    }

    fillFromPreviousValues(data: SWOTAnalysisValues): SWOTAnalysisValues {
        let ownData = data["swot-classify-alternate-actions"];
        if (ownData === undefined) {
            ownData = {
                actions: [],
                classifications: []
            }
        }

        let previousStep = data["alternative-actions"];
        if (previousStep !== undefined) {
            for (let i = 0; i < previousStep.actions.length; i++) {
                let action = previousStep.actions[i];
                for (let e = 0; e < action.alternatives.length; e++) {
                    let indexName = action.name + "-" + e;

                    let newAction: ClassifiedAlternateAction = {
                        indexName: indexName,
                        index: e,
                        alreadyAdded: false,
                        name: action.name,
                        action: action.alternatives[e]
                    }
                    ownData.actions.push(newAction);
                }
            }
        }

        data["swot-classify-alternate-actions"] = ownData;

        return data;
    }

    validateData(data: SWOTAnalysisValues): UIError[] {
        const values = data["swot-classify-alternate-actions"];
        const errors = new Array<UIError>();
        if (values !== undefined) {
            for (let i = 0; i < values.classifications.length; i++) {
                let value = values.classifications[i];
                if (value.name === null || value.name === "") {
                    errors.push({
                        id: value.droppableID + "-classification",
                        message: "Bitte ausfüllen!",
                        level: "error"
                    });
                }
                if (value.actions.length <= 0) {
                    errors.push({
                        id: value.droppableID + "-action-size",
                        message: "Die Klassifikation muss mindestens eine Handlungsalternative haben",
                        level: "error"
                    });
                }
            }
        }


        return errors;
    }


}
