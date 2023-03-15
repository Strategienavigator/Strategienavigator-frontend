import React, {PureComponent} from "react";
import {ClassifiedAlternateAction} from "../../SWOTClassifyAlternativeActionsComponent";


interface ClassifyingCardListProps {
    actions: ClassifiedAlternateAction[]
    onClassificationClick: (id: string) => void
    disabled: boolean,
    cardElement: JSX.Element
    text?: string
}

class ClassifyingCardList extends PureComponent<ClassifyingCardListProps, {}> {
    render() {
        return (
            <>
                <div className={"actionCards"}>
                    {this.props.actions.map((action, index) => {
                        return React.cloneElement(this.props.cardElement, {
                            key: action.name + "-" + action.index + "-" + index,
                            action: action,
                            onChangeClick: this.props.onClassificationClick,
                            disabled: this.props.disabled,
                        });
                    })}
                </div>

                {(this.props.actions.length <= 0) && (
                    <span>
                        {this.props.text ?? "Keine Handlungsalternativen zugeordnet..."}
                    </span>
                )}
            </>
        );
    }
}

export {
    ClassifyingCardList
}
