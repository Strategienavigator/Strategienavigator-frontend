import React, {FormEvent} from "react";
import {Col, Form, ProgressBar, Row} from "react-bootstrap";
import {
    CardComponent,
    CardComponentField,
    CardComponentFields
} from "../../../../../general-components/CardComponent/CardComponent";
import {isDesktop} from "../../../../../general-components/Desktop";
import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {SWOTAnalysisValues} from "../../SWOTAnalysis";
import {SWOTAlternativeActions} from "./SWOTAlternativeActions";
import {compareWithoutFunctions} from "../../../../../general-components/ComponentUtils";


export interface AlternateAction {
    name: string
    hasNone: boolean
    first: CardComponentField
    second: CardComponentField
    alternatives: CardComponentFields
}

export interface SWOTAlternativeActionsValues {
    actions: AlternateAction[]
}

interface SWOTAlternativeActionsState {
}

export class SWOTAlternativeActionsComponent extends Step<SWOTAnalysisValues, SWOTAlternativeActionsState> {


    public constructor(props: Readonly<StepProp<SWOTAnalysisValues>> | StepProp<SWOTAnalysisValues>);
    public constructor(props: StepProp<SWOTAnalysisValues>, context: any);
    public constructor(props: StepProp<SWOTAnalysisValues> | Readonly<StepProp<SWOTAnalysisValues>>, context?: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<SWOTAnalysisValues>>, nextState: Readonly<SWOTAlternativeActionsState>, nextContext: any): boolean {
         let shouldUpdate = !shallowCompareStepProps(this.props, nextProps);

         if(!shouldUpdate){
             shouldUpdate = this.props.save.data["alternative-actions"] !== nextProps.save.data["alternative-actions"];
         }



        return shouldUpdate;
    }

    changedSelected = (e: FormEvent<HTMLSelectElement>) => {
        let currentAction = this.getCurrentAction();
        if (currentAction !== undefined) {
            let formIndex = e.currentTarget.value;
            let index;

            if (e.currentTarget.id === "first") {
                index = this.findActionIndex(formIndex, currentAction.second.id as string);
            } else if (e.currentTarget.id === "second") {
                index = this.findActionIndex(currentAction.first.id as string, formIndex);
            }


            if (index !== undefined) {
                this.setState({
                    currentActionIndex: index
                });
            }
        } else {
            this.setState({
                currentActionIndex: 0
            });
        }

    }

    findActionIndex = (firstId: string, secondId: string) => {
        const actions = this.getActions();
        if (actions !== undefined) {
            return actions.findIndex((action =>
                    (action.first.id === firstId) && (action.second.id === secondId)
            ));
        }
    }

    private getActions() {
        return this.props.save.data["alternative-actions"]?.actions;
    }

    private getCurrentAction() {
        let actions = this.getActions();
        if (actions !== undefined)
            return actions[this.props.currentSubStep];
        else
            return undefined;
    }

    build(): JSX.Element {
        let minAlternativeActions = SWOTAlternativeActions.minAlternatives;
        let maxAlternativeActions = SWOTAlternativeActions.maxAlternatives;
        const actions = this.getActions();
        let currentAction = this.getCurrentAction();

        if (actions !== undefined && currentAction !== undefined) {

            let firstValue, secondValue;

            firstValue = currentAction.first.id ?? "";
            secondValue = currentAction.second.id ?? "";

            // PROGRESS
            let currentProgress = ((this.props.currentSubStep) / actions.length) * 100;
            if (this.props.disabled) {
                currentProgress = 100;
            }

            return (
                <div className={"alternative-actions"}>
                    <ProgressBar striped label={currentProgress.toFixed(0) + " %"} now={currentProgress}
                                 className={"progressBar"}/>

                    <Row className={"mb-3 mt-3"}>
                        <Col sm={isDesktop() ? 6 : 12}>
                            <Form.Select id={"first"}
                                         disabled={!this.props.disabled}
                                         value={firstValue}
                                         onChange={this.changedSelected}>
                                {actions.map((value, index) => {
                                    return (
                                        <option
                                            key={"S" + index}
                                            disabled={!this.props.disabled}
                                            value={value.first.id ?? ""}
                                        >
                                            {value.first.id + " " + value.first.name}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Col>
                        <Col sm={isDesktop() ? 6 : 12}>
                            <Form.Select id={"second"}
                                         disabled={!this.props.disabled}
                                         value={secondValue}
                                         onChange={this.changedSelected}>
                                {actions.map((value, index) => {
                                    return (
                                        <option
                                            key={"S" + index}
                                            disabled={!this.props.disabled}
                                            value={value.second.id ?? ""}
                                        >
                                            {value.second.id + " " + value.second.name}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Col>
                    </Row>

                    <Form.Check
                        id={"no-alternative"}
                        className={"mb-3"}
                        disabled={this.props.disabled}
                        type={"checkbox"}
                        label={"Keine Handlungsalternative"}
                        checked={currentAction.hasNone}
                        onChange={this.hasNoAlternativeChanged.bind(this)}
                    />
                    <CardComponent
                        name={currentAction.name}
                        disabled={this.props.disabled}
                        min={minAlternativeActions}
                        max={maxAlternativeActions}
                        hide={currentAction.hasNone}
                        values={currentAction.alternatives}
                        onChanged={this.alternativesChanged}
                        placeholder={{
                            name: "Strategische Handlungsoption"
                        }}
                    />

                    {/*{this.getError("alternative-action")}*/}
                </div>
            );
        }

        return <p>ERROR</p>;

    }

    getFirstInvalidIndex = () => {
        const actions = this.getActions();

        if (actions !== undefined) {
            let i = 0;
            for (let action of actions) {

                if (action.hasNone) {
                    i++;
                } else if (action.alternatives.length > 0) {
                    let invalidAlernative = false;
                    for (const alernative of action.alternatives) {
                        if (alernative.name.length < 1) {
                            invalidAlernative = true;
                        }
                        if (alernative.desc.length < 1) {
                            invalidAlernative = true;
                        }
                    }
                    if (!invalidAlernative) {
                        i++;
                    }
                }
            }
            return i;
        }
        return 0;
    }

    private hasNoAlternativeChanged(e: React.ChangeEvent<HTMLInputElement>) {
        const value = e.target.checked;
        this.updateAlternative(this.props.currentSubStep, action => {
            action.hasNone = value;
            return action;
        });
    }

    private updateAlternative(index: number, fn: (action: AlternateAction) => AlternateAction) {

        this.props.saveController.onChanged(save => {
            const actionsData = save.data["alternative-actions"];

            if (actionsData !== undefined) {
                actionsData.actions[index] = fn(actionsData.actions[index]);
            }
        });
    }

    private alternativesChanged = (cardComponents: CardComponentFields) => {
        this.updateAlternative(this.props.currentSubStep, action => {
            action.alternatives = cardComponents;
            return action;
        });
    };
}
