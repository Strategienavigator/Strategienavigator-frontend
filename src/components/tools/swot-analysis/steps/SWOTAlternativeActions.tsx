import {FormComponent, ResetType} from "../../../../general-components/Tool/FormComponent/FormComponent";
import React, {FormEvent, RefObject} from "react";
import {SwotFactorsValues} from "./SWOTFactors";
import {Col, Form, ProgressBar, Row, Tab} from "react-bootstrap";
import {
    CardComponent,
    CardComponentField,
    CardComponentFields
} from "../../../../general-components/CardComponent/CardComponent";
import {isDesktop} from "../../../../general-components/Desktop";
import {extractCardComponentField, extractFromForm} from "../../../../general-components/FormHelper";


export interface AlternateAction {
    name: string
    hasNone: boolean
    first: CardComponentField | null
    second: CardComponentField | null
    alternatives: CardComponentFields
}

export interface SWOTAlternativeActionsValues {
    actions: AlternateAction[]
}

export interface ActionInterface {
    first: CardComponentField
    second: CardComponentField
    name: string
}

interface SWOTAlternativeActionsState extends SwotFactorsValues {
    actions: AlternateAction[],
    factors: {
        chances: CardComponentFields
        risks: CardComponentFields
        strengths: CardComponentFields
        weaknesses: CardComponentFields
    }
}

export class SWOTAlternativeActions extends FormComponent<SWOTAlternativeActionsValues, SWOTAlternativeActionsState> {
    private currentActionIndex: number = 0;
    private cardComponentFieldsRefs = Array<RefObject<CardComponent>>();

    constructor(props: any) {
        super(props);

        this.state = {
            factors: {
                chances: [],
                weaknesses: [],
                strengths: [],
                risks: []
            },
            actions: []
        }
    }

    nextAction = () => {
        if (this.validateCurrent()) {
            if (this.currentActionIndex < this.state.actions.length - 1) {
                this.currentActionIndex++;

                if (this.currentActionIndex >= this.state.actions.length - 1) {
                    this.props.stepComp?.restoreFooter();
                }
                this.forceUpdate();
            }
        }
    }

    changedSelected = (e: FormEvent<HTMLSelectElement>) => {
        let currentAction = this.state.actions[this.currentActionIndex];
        let currentActionName = currentAction.name.split("-");

        let formIndex = e.currentTarget.value;
        let index = null;

        if (e.currentTarget.id === "first") {
            index = this.findActionIndex(formIndex, currentActionName[1] as string);
        } else if (e.currentTarget.id === "second") {
            index = this.findActionIndex(currentActionName[0] as string, formIndex);
        }

        if (index !== null) {
            this.currentActionIndex = index;
        }
        this.forceUpdate();
    }

    findActionIndex = (firstName: string, secondName: string) => {
        let index = 0;
        for (const action of this.state.actions) {
            let name = action.name.split("-");
            if (
                (name[0] === firstName) &&
                (name[1] === secondName)
            ) {
                return index;
            }
            index++;
        }
        return null;
    }

    build(): JSX.Element {
        let minAlternativeActions = 0;
        let maxAlternativeActions = 2;

        let currentAction = this.state.actions[this.currentActionIndex];
        let currentActionName = currentAction?.name.split("-");
        let firstValue, secondValue;

        firstValue = (currentActionName !== undefined) ? currentActionName[0] : "";
        secondValue = (currentActionName !== undefined) ? currentActionName[1] : "";

        // PROGRESS
        let currentProgress = ((this.currentActionIndex + 1) / this.state.actions.length) * 100;
        if (this.disabled) {
            currentProgress = 100;
        }

        return (
            <div className={"alternative-actions"}>
                <ProgressBar striped label={currentProgress.toFixed(0) + " %"} now={currentProgress}
                             className={"progressBar"}/>

                <Row className={"mb-3 mt-3"}>
                    <Col sm={isDesktop() ? 6 : 12}>
                        <Form.Select id={"first"} disabled={!this.disabled} onChange={(e) => {
                            this.changedSelected(e);
                        }} value={firstValue}>
                            {this.state.factors.strengths.map((value, index) => {
                                return (
                                    <option
                                        key={"S" + index}
                                        disabled={!this.disabled}
                                        value={String(value.id)}
                                    >
                                        {value.id + " " + value.name}
                                    </option>
                                );
                            })}
                            {this.state.factors.weaknesses.map((value, index) => {
                                return (
                                    <option
                                        key={"W" + index}
                                        disabled={!this.disabled}
                                        value={String(value.id)}
                                    >
                                        {value.id + " " + value.name}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Col>
                    <Col sm={isDesktop() ? 6 : 12}>
                        <Form.Select id={"second"} disabled={!this.disabled}
                                     value={secondValue}
                                     onChange={(e) => {
                                         this.changedSelected(e);
                                     }}>
                            {this.state.factors.chances.map((value, index) => {
                                return (
                                    <option
                                        key={"C" + index}
                                        disabled={!this.disabled}
                                        value={String(value.id)}
                                    >
                                        {value.id + " " + value.name}
                                    </option>
                                );
                            })}
                            {this.state.factors.risks.map((value, index) => {
                                return (
                                    <option
                                        key={"R" + index}
                                        disabled={!this.disabled}
                                        value={String(value.id)}
                                    >
                                        {value.id + " " + value.name}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Col>
                </Row>

                <Tab.Container activeKey={this.currentActionIndex}>
                    <Tab.Content>
                        {this.state.actions.map((value, index) => {
                            return (
                                <Tab.Pane key={index}
                                          eventKey={index}>
                                    <Form.Check
                                        id={"no-alternative-" + index}
                                        className={"mb-3"}
                                        disabled={this.disabled}
                                        type={"checkbox"}
                                        name={value.name + "[][noalternative]"}
                                        label={"Keine Handlungsalternative"}
                                        checked={value.hasNone}
                                        onChange={(e) => {
                                            this.noAlternativeChanged(index, e);
                                        }}
                                    />
                                    <CardComponent
                                        name={value.name}
                                        disabled={this.disabled}
                                        min={minAlternativeActions}
                                        max={maxAlternativeActions}
                                        values={value.alternatives}
                                        ref={this.cardComponentFieldsRefs[index]}
                                        placeholder={{
                                            name: "Strategische Handlungsoption"
                                        }}
                                    />
                                </Tab.Pane>
                            );
                        })}
                    </Tab.Content>
                </Tab.Container>

                {this.getError("alternative-action")}
            </div>
        );
    }

    onReset = (type: ResetType) => {
        this.currentActionIndex = 0;

        if (type.same) {
            this.setState(state => {
                let actions = state.actions;
                for (const action of actions) {
                    action.hasNone = false;
                }
                return {
                    actions: state.actions
                };
            });
        }
    }

    extractValues(e: FormEvent<HTMLFormElement>): SWOTAlternativeActionsValues {
        let actions: AlternateAction[] = [];

        for (let action of this.state.actions) {
            let name = action.name;
            let none = extractFromForm(e, name + "[][noalternative]") as boolean;
            let cardComponent = extractCardComponentField(e, name);

            if (none) {
                cardComponent = [];
            }

            let first = cardComponent[0] || null
            let second = cardComponent[1] || null;

            actions.push({
                name: name,
                hasNone: none,
                alternatives: cardComponent,
                first: first,
                second: second
            });
        }

        this.setValues({
            actions: actions
        });

        return this.values as SWOTAlternativeActionsValues;
    }

    changeControlFooter(): void {
        if (this.currentActionIndex < this.state.actions.length - 1) {
            this.props.stepComp?.addCustomNextButton("Nächster", this.nextAction);
        }
    }

    rebuildValues = async (values: SWOTAlternativeActionsValues) => {
        let factors = this.props.stepComp?.getFormValues("factors") as SwotFactorsValues;
        let actions: AlternateAction[] = [];

        for (let action of values.actions) {
            actions.push(action);
            let ref = React.createRef<CardComponent>();
            this.cardComponentFieldsRefs.push(ref);
        }

        this.setState({
            actions: actions,
            factors: factors.factors
        });
    }

    buildPreviousValues = async () => {
        let values = this.props.stepComp?.getPreviousStep<SwotFactorsValues>();
        let factors = values?.factors;

        if (factors !== undefined) {
            let strengths = factors.strengths;
            let weaknesses = factors.weaknesses;
            let chances = factors.chances;
            let risks = factors.risks;

            let actions: AlternateAction[] = [];

            for (const item1 of strengths.concat(weaknesses)) {
                for (const item2 of chances.concat(risks)) {
                    actions.push({
                        name: item1.id + "-" + item2.id,
                        first: item1,
                        second: item2,
                        hasNone: false,
                        alternatives: []
                    });
                    let ref = React.createRef<CardComponent>();
                    this.cardComponentFieldsRefs.push(ref);
                }
            }

            this.setState({
                actions: actions,
                factors: factors
            });
        }
    }

    submit = async (values: SWOTAlternativeActionsValues) => {

    }

    validate(values: SWOTAlternativeActionsValues): boolean {
        return this.validateCurrent();
    }

    validateCurrent = () => {
        let currentAction = this.state.actions[this.currentActionIndex];
        let currentCardComponentField = this.cardComponentFieldsRefs[this.currentActionIndex].current;

        if (currentCardComponentField) {
            if (currentAction.hasNone) {
                currentCardComponentField.removeAllCards();
                return true;
            }

            if (currentCardComponentField.getRefs().length <= 0) {
                this.addError("alternative-action", "Bitte wählen Sie eine Handlungsalternative!");
                return false;
            }

            let values = currentCardComponentField.getRefs();
            for (const result of values) {
                if (!result.current?.isValid()) {
                    this.addError("alternative-action", "Überprüfen Sie Ihre getätigten Handlungsalternativen!");
                    return false;
                }
            }

        }

        return true;
    }

    private noAlternativeChanged(index: number, e: React.ChangeEvent<HTMLInputElement>) {
        let value = e.target.checked;

        this.setState(state => {
            let actions = state.actions;
            actions[index].hasNone = value;

            return {
                actions: actions
            }
        }/*, () => {
            if (this.currentAction !== this.state.actions.length - 1 && value) {
                this.nextAction();
            }
        }*/);
    }
}
