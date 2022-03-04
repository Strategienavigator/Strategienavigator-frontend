import React, {PureComponent} from "react";
import {ClassifiedAlternateAction} from "../../SWOTClassifyAlternativeActionsComponent";
import {ClassifyingCard} from "../ClassifyingCard/ClassifyingCard";

interface ClassifyingCardListProps {
    actions: ClassifiedAlternateAction[]
    onOpenClassificationModalClick: (id: string) => void
}

class ClassifyingCardList extends PureComponent<ClassifyingCardListProps, {}> {
    render() {
        return <>
            <div className={"actionCards"}>
                {this.props.actions.map((action) => {
                    return <ClassifyingCard action={action}
                                            onChangeClick={this.props.onOpenClassificationModalClick}/>;
                })}
            </div>

            {(this.props.actions.length <= 0) && (
                <span>
                    Keine Handlungsalternativen zugeordnet...
                </span>
            )}
        </>;
    }
}

export {
    ClassifyingCardList
}
