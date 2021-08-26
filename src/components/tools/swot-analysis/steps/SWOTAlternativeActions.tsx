import FormComponent from "../../../../general-components/Form/FormComponent";
import {FormEvent} from "react";
import {SwotFactorsValues} from "./SWOTFactors";
import {Button, Form, InputGroup, Tab} from "react-bootstrap";
import CardComponent, {CardComponentField} from "../../../../general-components/CardComponent/CardComponent";
import {setControlFooterItem} from "../../../../general-components/ControlFooter/ControlFooter";
import {faCaretRight, faTimes} from "@fortawesome/free-solid-svg-icons/";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

export interface SWOTAlternativeActionsValues extends SwotFactorsValues {

}

interface ActionInterface {
    first: CardComponentField
    second: CardComponentField
}

class SWOTAlternativeActions extends FormComponent<SWOTAlternativeActionsValues, any> {
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

    build(): JSX.Element {
        let minAlternativeActions = 0;
        let maxAlternativeActions = 2;

        let currentAction = this.actions[this.currentAction];
        let currentActionID = currentAction?.first.id + "-" + currentAction?.second.id;

        return (
            <div className={"alternative-actions"}>
                <InputGroup className={"mb-2"}>
                    <Form.Select disabled={true} onChange={() => {
                    }} value={currentAction?.first.name + "|" + currentAction?.first.id}>
                        {this.factors?.strengths.map((value, index) => {
                            return (
                                <option key={"S" + index} disabled={true}
                                        value={value.name + "|" + value.id}>{value.id + " " + value.name}</option>
                            );
                        })}
                        {this.factors?.weaknesses.map((value, index) => {
                            return (
                                <option key={"W" + index} disabled={true}
                                        value={value.name + "|" + value.id}>{value.id + " " + value.name}</option>
                            );
                        })}
                    </Form.Select>
                    <Form.Select disabled={true} value={currentAction?.second.name + "|" + currentAction?.second.id}
                                 onChange={() => {
                                 }}>
                        {this.factors?.chances.map((value, index) => {
                            return (
                                <option key={"C" + index} disabled={true}
                                        value={value.name + "|" + value.id}>{value.id + " " + value.name}</option>
                            );
                        })}
                        {this.factors?.risks.map((value, index) => {
                            return (
                                <option key={"R" + index} disabled={true}
                                        value={value.name + "|" + value.id}>{value.id + " " + value.name}</option>
                            );
                        })}
                    </Form.Select>
                </InputGroup>

                <Button size={"sm"} variant={"dark"} onClick={() => this.nextAction()}>
                    <FontAwesomeIcon icon={faTimes}/> Keine Handlungsalternative
                </Button>

                <Tab.Container activeKey={this.currentAction}>
                    <Tab.Content>
                        <Tab.Pane key={this.currentAction}
                                  eventKey={this.currentAction}>
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
                    </Tab.Content>
                </Tab.Container>
            </div>
        );
    }

    extractValues(e: FormEvent<HTMLFormElement>): SWOTAlternativeActionsValues {
        return this.values as SWOTAlternativeActionsValues;
    }

    prepareValues = async () => {
        setControlFooterItem(3, {
            button: {
                text: "Nächster",
                icon: faCaretRight,
                callback: this.nextAction
            }
        });

        this.factors = this.props.stepComp?.getPreviousStep()?.getValues() as SwotFactorsValues;
        this.factors = {
            weaknesses: [
                {
                    name: "Gewinnverlust",
                    desc: "",
                    id: "a"
                },
                {
                    name: "Schlechte PR",
                    desc: "",
                    id: "b"
                }
            ],
            strengths: [
                {
                    name: "Hohe Mitarbeitermotivation",
                    desc: "",
                    id: "A"
                }
            ],
            chances: [
                {
                    name: "Liquidität",
                    desc: "",
                    id: "1"
                }
            ],
            risks: [
                {
                    name: "Umweltverschmutzung",
                    desc: "",
                    id: "I"
                },
                {
                    name: "Steigende Inflation",
                    desc: "",
                    id: "II"
                }
            ]
        };

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

            this.currentAction = 0;
        }

        this.setValues(this.factors);
    }

    submit = async (values: any) => {

    }

    validate(values: any): boolean {
        return true;
    }

}

export default SWOTAlternativeActions;