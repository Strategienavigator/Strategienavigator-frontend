import React, {PureComponent} from "react";
import {ClassificationValues,} from "../SWOTClassifyAlternativeActionsComponent";
import {SelectClassificationModal} from "./SelectClassificationModal";

import "./modal-classifying.scss";
import {ClassifyingCard} from "./ClassifyingCard/ClassifyingCard";
import {ClassificationAccordions} from "../NormalClassifying/ClassificationAccordions/ClassificationAccordions";
import {NormalClassifyingProps} from "../NormalClassifying/NormalClassifying";


interface ModalClassifyingProps extends NormalClassifyingProps {
}

interface ModalClassifyingState {
    openClassificationModal: boolean
    lastSelectedAction?: string
}

class ModalClassifying extends PureComponent<ModalClassifyingProps, ModalClassifyingState> {

    constructor(props: ModalClassifyingProps | Readonly<ModalClassifyingProps>) {
        super(props);

        this.state = {
            openClassificationModal: false
        }
    }

    render() {
        const classifications = this.props.classifications;

        return (
            <>
                <ClassificationAccordions
                    actions={this.props.actions}
                    classifications={classifications}
                    disabled={this.props.disabled}
                    classificationController={this.props.classificationController}
                    onClassificationClick={this.onOpenClassificationModalClick}
                    cardElement={<ClassifyingCard/>}
                />

                <SelectClassificationModal
                    open={this.state.openClassificationModal}
                    action={this.state.lastSelectedAction ?? undefined}
                    classifications={classifications}
                    onSelect={this.changeClassification}
                    onClose={this.closeClassificationModal}
                />
            </>
        )
    }

    private changeClassification = (oldClassification: ClassificationValues | null, newClassification: ClassificationValues | null, action: string) => {
        this.props.classificationController.updateActionClassification(oldClassification?.droppableID ?? null, newClassification?.droppableID ?? null, action);
    }


    private closeClassificationModal = () => {
        this.setState({
            openClassificationModal: false,
            lastSelectedAction: undefined
        });
    }

    private openClassificationModal = (action: string) => {
        this.setState({
            openClassificationModal: true,
            lastSelectedAction: action,
        });
    }

    private onOpenClassificationModalClick = (id: string) => {
        this.openClassificationModal(id);
    }

}

export {
    ModalClassifying
}
