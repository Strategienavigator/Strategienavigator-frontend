import React from "react";
import {Card} from "react-bootstrap";
import {CardComponentField} from "../../../../../general-components/CardComponent/CardComponent";
import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {DragAndDropClassifying} from "./DragAndDropClassifying";
import {ModalClassifying} from "./ModalClassifying/ModalClassifying";
import {SWOTAnalysisValues} from "../../SWOTAnalysis";
import {SWOTClassifyAlternativeActions} from "./SWOTClassifyAlternativeActions";
import {NormalClassifying} from "./NormalClassifying/NormalClassifying";
import {DesktopContext} from "../../../../../general-components/Contexts/DesktopContext";


export interface ClassificationController {
    addClassification: () => void
    removeClassification: (id: string) => void
    updateActionClassification: (oldClassificationId: string | null, newClassificationId: string | null, indexName: string) => void
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


    public static noneDroppableID = "classifications-draggables";
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

    addClassification = () => {
        const classifications = this.requireStepData().classifications;
        let highestId = 0;
        if (classifications.length > 0) {
            highestId = parseInt(classifications[classifications.length - 1].droppableID.split("-")[1]);
        }
        const newDroppableID = "droppable-" + (highestId + 1);

        this.props.saveController.onChanged(save => {
            save.data["swot-classify-alternate-actions"]?.classifications.push({
                name: "",
                actions: [],
                droppableID: newDroppableID
            });
        });
    }

    getClassification = (droppableID: string): ClassificationValues | undefined => {
        return this.requireStepData().classifications.find(classification => classification.droppableID === droppableID);
    }

    removeClassification = (droppableID: string): void => {
        this.props.saveController.onChanged(save => {
            const classificationIndex = save.data["swot-classify-alternate-actions"]?.classifications.findIndex(c => c.droppableID === droppableID);
            if (classificationIndex !== undefined && classificationIndex >= 0) {
                const classification = save.data["swot-classify-alternate-actions"]?.classifications[classificationIndex];

                const toRemove = classification?.actions.map((value) => value.indexName);

                save.data["swot-classify-alternate-actions"]?.classifications.splice(classificationIndex, 1);

                const actions = save.data["swot-classify-alternate-actions"]?.actions;
                if (actions !== undefined && toRemove !== undefined && toRemove.length > 0) {
                    actions.forEach(a => {
                        if (toRemove.some(action => action === a.indexName)) {
                            a.alreadyAdded = false;
                        }
                    })
                }
            }
        });

    }

    onClassificationNameChange = (droppableID: string, newName: string) => {
        this.props.saveController.onChanged(save => {
            const classification = save.data["swot-classify-alternate-actions"]?.classifications.find(c => c.droppableID === droppableID);
            if (classification !== undefined) {
                classification.name = newName;
            }
        });
    }

    updateActionClassification = (oldClassificationId: string | null, newClassificationId: string | null, indexName: string) => {
        this.props.saveController.onChanged(save => {
            const data = save.data["swot-classify-alternate-actions"];
            if (data !== undefined) {

                const action = data.actions.find(a => a.indexName === indexName)
                if (action !== undefined) {

                    const oldClassification = oldClassificationId !== null ? data.classifications.find(c => c.droppableID === oldClassificationId) : undefined;
                    const newClassification = newClassificationId !== null ? data.classifications.find(c => c.droppableID === newClassificationId) : undefined;

                    if (oldClassification !== undefined) {
                        const aIndex = oldClassification.actions.findIndex(a => a.indexName === indexName);
                        if (aIndex !== undefined && aIndex >= 0) {
                            oldClassification.actions.splice(aIndex, 1);
                            oldClassification.actions.sort(SWOTClassifyAlternativeActions.compareClassifiedAlternateActions);
                        }
                    }

                    if (newClassification !== undefined) {
                        newClassification.actions.push({...action, alreadyAdded: true});
                        newClassification.actions.sort(SWOTClassifyAlternativeActions.compareClassifiedAlternateActions);

                        action.alreadyAdded = true;
                    } else {
                        action.alreadyAdded = false;
                    }
                }
            }
        });
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
        let normal = false, drag = false, modal = false;

        return (
            <DesktopContext.Consumer children={ isDesktop => {
                if (!isDesktop) {
                    modal = true;
                } else if (actionCount > dragAndDropActionSize) {
                    normal = true;
                }
                if (normal) {
                    return (
                        <NormalClassifying
                            actions={actions}
                            disabled={this.props.disabled}
                            classifications={classifications}
                            classificationController={this.classificationController}
                        />
                    );
                } else if (drag) {
                    return (
                        <DragAndDropClassifying
                            step3Instance={this}
                        />
                    );
                } else if (modal) {
                    return (
                        <ModalClassifying
                            actions={actions}
                            disabled={this.props.disabled}
                            classifications={classifications}
                            classificationController={this.classificationController}
                        />
                    );
                }
                return <></>;
            }}/>
        );
    }

    private requireStepData = () => {
        const data = this.props.save.data["swot-classify-alternate-actions"];
        if (data === undefined) {
            throw new Error("Data missing");
        }
        return data;
    }

}

export {
    SWOTClassifyAlternativeActionsComponent
}
