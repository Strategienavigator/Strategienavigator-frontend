import {ResetType} from "../../../../../general-components/Tool/FormComponent/FormComponent";
import React, {FormEvent} from "react";
import {Draggable, DropResult} from "react-beautiful-dnd";
import {Card} from "react-bootstrap";
import {SWOTAlternativeActionsValues} from "../SWOTAlternativeActions";
import {CardComponentField} from "../../../../../general-components/CardComponent/CardComponent";
import {Step} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {DragAndDropClassifying} from "./DragAndDropClassifying";
import {NormalClassifying} from "./NormalClassifying/NormalClassifying";
import {isDesktop} from "../../../../../general-components/Desktop";


export interface ClassifiedAlternateAction {
    name: string
    index: number
    indexName: string
    alreadyAdded: boolean
    action: CardComponentField
}

export interface Classification {
    droppableID: string,
    name: string | null,
    actions: Map<string, ClassifiedAlternateAction>
}

interface ClassificationValues {
    droppableID: string,
    name: string | null,
    actions: ClassifiedAlternateAction[]
}

export interface SWOTClassifyAlternativeActionsValues {
    classifications: ClassificationValues[],
    actions: ClassifiedAlternateAction[]
}

class SWOTClassifyAlternativeActions extends Step<SWOTClassifyAlternativeActionsValues, any> {
    private actions = new Map<string, ClassifiedAlternateAction>();
    private classifications = new Map<string, Classification>();
    private noneDroppableID = "classifications-draggables";
    private maxClassifications = 10;

    getNoneDroppableID = () => {
        return this.noneDroppableID;
    }

    sortActionMap = (map: Map<string, ClassifiedAlternateAction>): Map<string, ClassifiedAlternateAction> => {
        return new Map(Array.from(map).sort());
    }

    onReset = (type: ResetType) => {
        this.classifications.clear();
        this.actions.forEach((value) => {
            value.alreadyAdded = false;
        });
    }

    addClassification = (droppableID: string | undefined) => {
        if (this.maxClassifications < this.classifications.size) {
            return;
        }

        if (droppableID === undefined) {
            droppableID = "droppable-" + 0;
        } else {
            let splitted = droppableID.split("-");
            let newIndex = parseInt(splitted[1]) + 1;
            droppableID = "droppable-" + newIndex;
        }

        let classification: Classification = {
            actions: new Map<string, ClassifiedAlternateAction>(),
            name: null,
            droppableID: droppableID
        };
        this.classifications.set(droppableID, classification);

        this.forceUpdate();
    }

    getClassifications = () => {
        return this.classifications;
    }

    getClassification = (droppableID: string): Classification | undefined => {
        return this.classifications.get(droppableID);
    }

    removeClassification = (droppableID: string): boolean => {
        let classification = this.classifications.get(droppableID);
        classification?.actions.forEach((value) => {
            value.alreadyAdded = false;
        });
        console.log();
        let deleted = this.classifications.delete(droppableID);
        this.forceUpdate();
        return deleted;
    }

    getAction = (draggableID: string): ClassifiedAlternateAction | undefined => {
        return this.actions.get(draggableID);
    }

    removeAction = (droppableID: string, draggableID: string): boolean => {
        let classification = this.getClassification(droppableID);
        if (classification) {
            let classificationAction = classification.actions.get(draggableID);
            if (classificationAction) {
                let action = this.actions.get(draggableID);
                if (action) {
                    action.alreadyAdded = false;
                }
                let deleted = classification.actions.delete(draggableID);
                this.forceUpdate();
                return deleted;
            }
        }
        return false;
    }

    onClassificationNameChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>, droppableID: string) => {
        let value = e.currentTarget.value;
        let classification = this.getClassification(droppableID);
        if (classification) {
            classification.name = value;
        }
    }

    getActions() {
        return this.actions;
    }

    getMaxClassificationSize() {
        return this.maxClassifications;
    }

    build(): JSX.Element {
        if (this.actions.size <= 0) {
            return (
                <Card body>
                    Es sind Keine Handlungsalternativen vorhanden...
                </Card>
            );
        }

        let dragAndDropActionSize = 0; // good would be maximum 14
        let showNormal;
        if (!isDesktop()) {
            showNormal = true;
        } else if (this.actions.size > dragAndDropActionSize) {
            showNormal = true;
        }

        return (showNormal === true) ? (
            <NormalClassifying
                step3instance={this}
            />
        ) : (
            <DragAndDropClassifying
                step3Instance={this}
            />
        );
    }

    extractValues(e: FormEvent<HTMLFormElement>): SWOTClassifyAlternativeActionsValues {
        let classifications: ClassificationValues[] = [];

        this.classifications.forEach((classification) => {
            let actions: ClassifiedAlternateAction[] = [];
            classification.actions.forEach((action) => {
                actions.push(action);
            });
            let classificationValue: ClassificationValues = {
                name: classification.name,
                droppableID: classification.droppableID,
                actions: actions
            };
            classifications.push(classificationValue);
        });

        let actions: ClassifiedAlternateAction[] = [];
        this.actions.forEach((value) => {
            actions.push(value);
        });

        return {
            classifications,
            actions: actions
        };
    }

    rebuildValues = async (values: SWOTClassifyAlternativeActionsValues) => {
        let globalActions = new Map<string, ClassifiedAlternateAction>();
        let classifications = new Map<string, Classification>();

        for (const classificationValue of values.classifications) {
            let actions = new Map<string, ClassifiedAlternateAction>();

            for (const action of classificationValue.actions) {
                actions.set(action.indexName, action);
                globalActions.set(action.indexName, action);
            }

            let classification: Classification = {
                name: classificationValue.name,
                droppableID: classificationValue.droppableID,
                actions: actions
            }

            classifications.set(classification.droppableID, classification);
        }
        this.classifications = classifications;

        values.actions.forEach((value) => {
            if (!globalActions.has(value.indexName)) {
                globalActions.set(value.indexName, value);
            }
        });
        this.actions = this.sortActionMap(globalActions);
    }

    buildPreviousValues = async () => {
        let previousStep = this.props.stepComp?.getPreviousStep<SWOTAlternativeActionsValues>();
        if (previousStep && this.actions.size <= 0) {
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
                    this.actions.set(indexName, newAction);
                }
            }
            this.forceUpdate();
        }
    }

    submit = async (values: SWOTClassifyAlternativeActionsValues) => {
    }

    validate(values: SWOTClassifyAlternativeActionsValues): boolean {
        let validated = true;

        for (let i = 0; i < values.classifications.length; i++) {
            let value = values.classifications[i];
            if (value.name === null || value.name === "") {
                this.addError(value.droppableID + "-classification", "Bitte ausfüllen!");
                validated = false;
            }
            if (value.actions.length <= 0) {
                this.addError(value.droppableID + "-action-size", "Die Klassifikation muss mindestens eine Handlungsalternative haben");
                validated = false;
            }
        }

        return validated;
    }

    changeControlFooter(): void {
    }

}

export {
    SWOTClassifyAlternativeActions
}
