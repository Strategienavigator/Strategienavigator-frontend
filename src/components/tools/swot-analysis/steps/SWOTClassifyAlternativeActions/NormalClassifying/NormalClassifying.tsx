import React, {Component} from "react";
import {ClassificationAccordions} from "./ClassificationAccordions/ClassificationAccordions";
import {
    ClassificationController,
    ClassificationValues,
    ClassifiedAlternateAction
} from "../SWOTClassifyAlternativeActionsComponent";
import {ClassifyingMenuCard} from "../ModalClassifying/ClassifyingCard/ClassifyingMenuCard";


export interface NormalClassifyingProps {
    actions: ClassifiedAlternateAction[],
    classifications: ClassificationValues[],
    disabled: boolean,
    classificationController: ClassificationController
}

class NormalClassifying extends Component<NormalClassifyingProps, any> {

    render = () => {
        const classifications = this.props.classifications;

        return (
            <>
                <ClassificationAccordions
                    classifications={classifications}
                    disabled={this.props.disabled}
                    classificationController={this.props.classificationController}
                    onClassificationClick={() => {
                    }}
                    actions={this.props.actions}
                    cardElement={
                        <ClassifyingMenuCard
                            classifications={classifications.filter((c) => c.name.length > 0)}
                            classificationController={this.props.classificationController}
                        />
                    }
                />
            </>
        );
    }

}

export {
    NormalClassifying
}