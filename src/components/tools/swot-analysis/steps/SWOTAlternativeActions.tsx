import {FormComponent} from "../../../../general-components/Form/FormComponent";
import {FormEvent} from "react";
import {SwotFactorsValues} from "./SWOTFactors";
import {Col, Form, Row, Tab} from "react-bootstrap";
import {CardComponent, CardComponentField} from "../../../../general-components/CardComponent/CardComponent";
import {setControlFooterItem} from "../../../../general-components/ControlFooter/ControlFooter";
import {faCaretLeft, faCaretRight} from "@fortawesome/free-solid-svg-icons/";
import {isDesktop} from "../../../../general-components/Desktop";

export interface SWOTAlternativeActionsValues extends SwotFactorsValues {

}

export interface ActionInterface {
    first: CardComponentField
    second: CardComponentField
}

export class SWOTAlternativeActions extends FormComponent<SWOTAlternativeActionsValues, any> {
    private factors: SwotFactorsValues | undefined;
    private actions: Array<ActionInterface> = [];
    private currentAction: number = 0;

    nextAction = () => {
        if (this.currentAction < this.actions.length - 1) {
            this.currentAction++;

            if (this.currentAction >= this.actions.length - 1) {
                this.props.stepComp?.setFooter();
            }
            this.forceUpdate();
        }
    }

    previousAction = () => {
        if (this.currentAction > 0) {
            this.currentAction--;
            this.forceUpdate();
        }
    }

    build(): JSX.Element {
        let minAlternativeActions = 0;
        let maxAlternativeActions = 2;

        let currentAction = this.actions[this.currentAction];
        let currentActionID = currentAction?.first.id + "-" + currentAction?.second.id;

        let firstValue, secondValue;

        if (!this.disabled) {
            firstValue = currentAction?.first.name + "|" + currentAction?.first.id;
            secondValue = currentAction?.second.name + "|" + currentAction?.second.id;
        }

        return (
            <div className={"alternative-actions"}>
                <Row className={"mb-3 mt-3"}>
                    <Col sm={isDesktop() ? 6 : 12}>
                        <Form.Select disabled={!this.disabled} onChange={() => {
                        }} value={firstValue}>
                            {this.factors?.strengths.map((value, index) => {
                                return (
                                    <option
                                        key={"S" + index}
                                        disabled={!this.disabled}
                                        value={value.name + "|" + value.id}
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
                                        value={value.name + "|" + value.id}
                                    >
                                        {value.id + " " + value.name}
                                    </option>
                                );
                            })}
                        </Form.Select>
                    </Col>
                    <Col sm={isDesktop() ? 6 : 12}>
                        <Form.Select disabled={!this.disabled}
                                     value={secondValue}
                                     onChange={() => {
                                     }}>
                            {this.factors?.chances.map((value, index) => {
                                return (
                                    <option
                                        key={"C" + index}
                                        disabled={!this.disabled}
                                        value={value.name + "|" + value.id}
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
                                        value={value.name + "|" + value.id}
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
                            return (
                                <Tab.Pane key={value}
                                          eventKey={value}>
                                    <Form.Switch
                                        className={"mb-3"}
                                        disabled={this.disabled}
                                        type={"checkbox"}
                                        name={currentActionID + "[][noalternative]"}
                                        label={"Keine Handlungsalternative"}
                                        onChange={() => this.nextAction()}
                                    />
                                    <CardComponent
                                        name={currentActionID}
                                        disabled={this.disabled}
                                        min={minAlternativeActions}
                                        max={maxAlternativeActions}
                                        placeholder={{
                                            name: "Strategische Handlungsoption"
                                        }}
                                    />
                                </Tab.Pane>
                            );
                        })}
                    </Tab.Content>
                </Tab.Container>
            </div>
        );
    }

    extractValues(e: FormEvent<HTMLFormElement>): SWOTAlternativeActionsValues {
        return this.values as SWOTAlternativeActionsValues;
    }

    changeControlFooter(): void {
        if (this.currentAction < this.actions.length - 1) {
            setControlFooterItem(1, {
                button: {
                    text: "Vorheriger",
                    icon: faCaretLeft,
                    callback: this.previousAction
                }
            });
            setControlFooterItem(3, {
                button: {
                    text: "Nächster",
                    icon: faCaretRight,
                    callback: this.nextAction
                }
            });
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
                }
            }
        }

        this.setValues(this.factors);
    }

    submit = async (values: any) => {

    }

    validate(values: any): boolean {
        return true;
    }

}
