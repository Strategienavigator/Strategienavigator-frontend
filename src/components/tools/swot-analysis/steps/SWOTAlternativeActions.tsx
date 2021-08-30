import {FormComponent} from "../../../../general-components/Form/FormComponent";
import React, {FormEvent, RefObject} from "react";
import {SwotFactorsValues} from "./SWOTFactors";
import {Col, Form, Row, Tab} from "react-bootstrap";
import {
    CardComponent,
    CardComponentField,
    CardComponentFields
} from "../../../../general-components/CardComponent/CardComponent";
import {isDesktop} from "../../../../general-components/Desktop";
import {extractCardComponentField, extractFromForm} from "../../../../general-components/FormHelper";

export interface SWOTAlternativeActionsValues {
    actions: {
        none: boolean,
        alternatives: CardComponentFields
    }[]
}

export interface ActionInterface {
    first: CardComponentField
    second: CardComponentField
}

export class SWOTAlternativeActions extends FormComponent<SWOTAlternativeActionsValues, any> {
    private factors: SwotFactorsValues | undefined;
    private actions: Array<ActionInterface> = [];
    private currentAction: number = 0;

    private currentNoAlternative: boolean | undefined;
    private cardComponentFieldsRefs = Array<RefObject<CardComponent>>();

    nextAction = () => {
        if (this.validateCurrent()) {
            if (this.currentAction < this.actions.length - 1) {
                this.currentAction++;

                if (this.currentAction >= this.actions.length - 1) {
                    this.props.stepComp?.restoreFooter();
                }
                this.forceUpdate();
            }
            this.currentNoAlternative = undefined;
        }
    }

    changedSelected = (e: FormEvent<HTMLSelectElement>) => {
        let index = 0;
        let action = this.actions[this.currentAction];

        if (e.currentTarget.id === "first") {
            let secondId = action.second.id;
            let splittedId = e.currentTarget.value.split("|");
            while (this.actions[index].first.id !== splittedId[0] || this.actions[index].second.id !== secondId) {
                index++;
            }
            this.currentAction = index;
        } else if (e.currentTarget.id === "second") {
            let firstId = action.first.id;
            let splittedId = e.currentTarget.value.split("|");
            while (this.actions[index].second.id !== splittedId[0] || this.actions[index].first.id !== firstId) {
                index++;
            }
            this.currentAction = index;
        }
        this.forceUpdate();
    }

    build(): JSX.Element {
        let minAlternativeActions = 0;
        let maxAlternativeActions = 2;

        let currentAction = this.actions[this.currentAction];
        let firstValue, secondValue;

        if (!this.disabled) {
            firstValue = currentAction?.first.id + "|" + currentAction?.first.name;
            secondValue = currentAction?.second.id + "|" + currentAction?.second.name;
        }

        return (
            <div className={"alternative-actions"}>
                <Row className={"mb-3 mt-3"}>
                    <Col sm={isDesktop() ? 6 : 12}>
                        <Form.Select id={"first"} disabled={!this.disabled} onChange={(e) => {
                            this.changedSelected(e);
                        }} value={firstValue}>
                            {this.factors?.strengths.map((value, index) => {
                                return (
                                    <option
                                        key={"S" + index}
                                        disabled={!this.disabled}
                                        value={value.id + "|" + value.name}
                                    >
                                        {value.id + " " + value.name}
                                    </option>
                                );
                            })}
                            {this.factors?.weaknesses.map((value, index) => {
                                return (
                                    <option
                                        key={"W" + index}
                                        disabled={!this.disabled}
                                        value={value.id + "|" + value.name}
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
                            {this.factors?.chances.map((value, index) => {
                                return (
                                    <option
                                        key={"C" + index}
                                        disabled={!this.disabled}
                                        value={value.id + "|" + value.name}
                                    >
                                        {value.id + " " + value.name}
                                    </option>
                                );
                            })}
                            {this.factors?.risks.map((value, index) => {
                                return (
                                    <option
                                        key={"R" + index}
                                        disabled={!this.disabled}
                                        value={value.id + "|" + value.name}
                                    >
                                        {value.id + " " + value.name}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Col>
                </Row>

                <Tab.Container activeKey={this.currentAction}>
                    <Tab.Content>
                        {Array.from(Array(this.actions.length), (_, i) => i).map(value => {
                            let name = this.actions[value].first.id + "-" + this.actions[value].second.id;

                            return (
                                <Tab.Pane key={value}
                                          eventKey={value}>
                                    <Form.Check
                                        className={"mb-3"}
                                        disabled={this.disabled}
                                        type={"checkbox"}
                                        name={name + "[][noalternative]"}
                                        label={"Keine Handlungsalternative"}
                                        onChange={(e) => {
                                            this.noAlternativeChanged(e);
                                            if (this.currentAction !== this.actions.length - 1) {
                                                this.nextAction();
                                            }
                                        }}
                                    />
                                    <CardComponent
                                        name={name}
                                        disabled={this.disabled}
                                        min={minAlternativeActions}
                                        max={maxAlternativeActions}
                                        ref={this.cardComponentFieldsRefs[value]}
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

    extractValues(e: FormEvent<HTMLFormElement>): SWOTAlternativeActionsValues {
        let actions = [];

        for (let action of this.actions) {
            let name = action.first.id + "-" + action.second.id;
            let none = extractFromForm(e, name + "[][noalternative]");
            let cardComponent = extractCardComponentField(e, name);

            if (none) {
                cardComponent = [];
            }

            actions.push({
                none: none,
                alternatives: cardComponent
            });
        }

        this.setValues({
            actions: actions
        });

        return this.values as SWOTAlternativeActionsValues;
    }

    changeControlFooter(): void {
        if (this.currentAction < this.actions.length - 1) {
            this.props.stepComp?.addCustomNextButton("Nächster", this.nextAction);
        }
    }

    prepareValues = async () => {
        this.factors = this.props.stepComp?.getPreviousStep()?.getValues() as SwotFactorsValues;

        if (this.factors !== undefined) {
            let strengths = this.factors.strengths;
            let weaknesses = this.factors.weaknesses;
            let chances = this.factors.chances;
            let risks = this.factors.risks;

            this.actions = [];

            for (const item1 of strengths.concat(weaknesses)) {
                for (const item2 of chances.concat(risks)) {
                    this.actions.push({
                        first: item1,
                        second: item2
                    });
                    let ref = React.createRef<CardComponent>();
                    this.cardComponentFieldsRefs.push(ref);
                }
            }
        }
    }

    submit = async (values: SWOTAlternativeActionsValues) => {

    }

    validate(values: SWOTAlternativeActionsValues): boolean {
        return this.validateCurrent();
    }

    validateCurrent = () => {
        let currentCardComponentField = this.cardComponentFieldsRefs[this.currentAction].current;

        if (currentCardComponentField) {
            if (this.currentNoAlternative === true) {
                currentCardComponentField.removeAllCards();
                return true;
            }

            if (currentCardComponentField.getValues().size <= 0) {
                this.addError("alternative-action", "Bitte wählen Sie eine Handlungsalternative!");
                return false;
            }


            let values = currentCardComponentField.getValues().values();
            let result = values.next();

            while (!result.done) {
                if (!result.value.current?.isValid()) {
                    this.addError("alternative-action", "Überprüfen Sie Ihre getätigten Handlungsalternativen!");
                    return false;
                }
                result = values.next();
            }

        }

        return true;
    }

    private noAlternativeChanged(e: React.ChangeEvent<HTMLInputElement>) {
        this.currentNoAlternative = e.target.checked;
    }
}
