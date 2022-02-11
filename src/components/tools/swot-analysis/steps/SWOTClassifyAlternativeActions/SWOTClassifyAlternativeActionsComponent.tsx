import React from "react";
import {Card} from "react-bootstrap";
import {CardComponentField} from "../../../../../general-components/CardComponent/CardComponent";
import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {DragAndDropClassifying} from "./DragAndDropClassifying";
import {NormalClassifying} from "./NormalClassifying/NormalClassifying";
import {isDesktop} from "../../../../../general-components/Desktop";
import {SWOTAnalysisValues} from "../../SWOTAnalysis";
import {SWOTClassifyAlternativeActions} from "./SWOTClassifyAlternativeActions";


export interface ClassificationController {
    addClassification: () => void
    removeClassification: (id: string) => void
    updateActionClassification: (oldClassificationId: string | null, newClassificationId: string | null, actionId: string) => void
    classificationNameChanged: (id: string, newName: string) => void
}

export interface ClassifiedAlternateAction {
    name: string
    index: number
    indexName: string
    alreadyAdded: boolean
    action: CardComponentField
}

export interface ClassificationValues {
    droppableID: string,
    name: string,
    actions: ClassifiedAlternateAction[]
}

export interface SWOTClassifyAlternativeActionsValues {
    /**
     * Klassifikationen mit zugeordneten Klassifikationen
     */
    classifications: ClassificationValues[],
    /**
     * Nicht zugeordnete Handlungsalternativen
     */
    actions: ClassifiedAlternateAction[]
}

class SWOTClassifyAlternativeActionsComponent extends Step<SWOTAnalysisValues, {}> {


    private classificationController: ClassificationController;

    constructor(props: StepProp<SWOTAnalysisValues>, context: any) {
        super(props, context);

        this.classificationController = {
            addClassification: this.addClassification,
            removeClassification: this.removeClassification,
            updateActionClassification: this.updateActionClassification,
            classificationNameChanged: this.onClassificationNameChange
        }

    }

    public static noneDroppableID = "classifications-draggables";

    private requireStepData = () => {
        const data = this.props.save.data["swot-classify-alternate-actions"];
        if (data === undefined) {
            throw new Error("Data missing");
        }
        return data;
    }

    addClassification = () => {

    }

    getClassification = (droppableID: string): ClassificationValues | undefined => {
        return this.requireStepData().classifications.find(classification => classification.droppableID === droppableID);
    }

    removeClassification = (droppableID: string): boolean => {
        let classification = this.getClassification(droppableID);
        classification?.actions.forEach((value) => {
            value.alreadyAdded = false;
        });

        // TODO remove classifications

        return classification !== undefined;
    }

    getAction = (draggableID: string): ClassifiedAlternateAction | undefined => {
        return undefined;
    }

    onClassificationNameChange = (droppableID: string, newName: string) => {
        let classification = this.getClassification(droppableID);
        // make classification copy
        if (classification) {
            classification.name = newName;
        }
    }


    updateActionClassification = () => {

    }

    build(): JSX.Element {
        const actions = this.props.save.data["swot-classify-alternate-actions"]?.actions;
        const classifications = this.props.save.data["swot-classify-alternate-actions"]?.classifications;
        const actionCount = actions?.length ?? 0;

        if (actions === undefined || classifications === undefined || actionCount < 1) {
            return (
                <Card body>
                    Es sind Keine Handlungsalternativen vorhanden...
                </Card>
            );
        }


        let dragAndDropActionSize = 0; // good would be maximum 14
        let showNormal;
        if (!isDesktop()) {
            showNormal = true; // change if you want drag and drop functionality
        } else if (actionCount > dragAndDropActionSize) {
            showNormal = true;
        }

        return (showNormal === true) ? (
            <NormalClassifying
                actions={actions}
                classifications={classifications}
                classificationController={this.classificationController}

            />
        ) : (
            <DragAndDropClassifying
                step3Instance={this}
            />
        );
    }

}

export {
    SWOTClassifyAlternativeActionsComponent
}
