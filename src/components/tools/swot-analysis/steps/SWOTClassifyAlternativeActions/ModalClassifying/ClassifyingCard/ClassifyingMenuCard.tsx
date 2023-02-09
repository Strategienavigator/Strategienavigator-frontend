import {ChangeEvent, Component, createRef} from "react";
import {ClassifyingCard, ClassifyingCardProps} from "./ClassifyingCard";
import {ClassificationController, ClassificationValues} from "../../SWOTClassifyAlternativeActionsComponent";

import "./classifying-menu-card.scss";
import {Card, FormSelect} from "react-bootstrap";
import {findClassification} from "../SelectClassificationModal";


interface ClassifyingMenuCardProps extends ClassifyingCardProps {
    classifications: ClassificationValues[],
    classificationController: ClassificationController
}

interface ClassifyingMenuCardState {
    show: boolean;
}

class ClassifyingMenuCard extends Component<ClassifyingMenuCardProps, ClassifyingMenuCardState> {
    state = {
        show: false
    };
    wrapperRef = createRef<HTMLDivElement>();

    componentDidMount() {
        document.addEventListener("mousedown", this.handleOutsideClick);
    }

    componentWillUnmount() {
        document.removeEventListener("mousedown", this.handleOutsideClick);
    }

    handleOutsideClick = (event: any) => {
        if (this.wrapperRef && !this.wrapperRef.current?.contains(event.target)) {
            this.setState({
                show: false
            });
        }
    }

    render() {
        let classes = ["menu"];

        if (this.state.show) {
            classes.push("show");
        }

        return (
            <div className={"actionCard menuCard"}>
                <ClassifyingCard
                    disabled={this.props.disabled}
                    action={this.props.action}
                    onChangeClick={() => {
                        this.setState({
                            show: !this.state.show
                        });
                    }}
                />

                <Card className={classes.join(" ")} ref={this.wrapperRef} body>
                    <FormSelect
                        htmlSize={this.props.classifications.length + 1}
                        onChange={this.changedClassification}
                    >
                        <option value={"_none"}>Keine Klassifikation</option>

                        {this.props.classifications.filter(c => c.name.length > 0).map((value, index) => {
                            return (
                                <option value={value.droppableID} key={value.droppableID + "-menu-option-" + index}>
                                    {value.name}
                                </option>
                            );
                        })}
                    </FormSelect>
                </Card>
            </div>
        );
    }

    public changedClassification = (e: ChangeEvent<HTMLSelectElement>) => {
        let droppableID = e.target.value;
        let classification = this.props.classifications.find(classification => classification.droppableID === droppableID);
        let foundClassification = findClassification(this.props.action?.indexName, this.props.classifications);

        let oldClassification: ClassificationValues | null = null;
        let newClassification: ClassificationValues | null;

        newClassification = classification ?? null;
        if (foundClassification) {
            oldClassification = foundClassification;
        }

        if (this.props.action) {
            this.props.classificationController.updateActionClassification(
                oldClassification?.droppableID ?? null,
                newClassification?.droppableID ?? null,
                this.props.action?.indexName
            );
        }

        this.setState({
            show: false
        });
    }

}

export {
    ClassifyingMenuCard
}