import FormComponent from "../../../../general-components/Form/FormComponent";
import {FormEvent} from "react";
import {SwotFactorsValues} from "./SWOTFactors";
import {Form, InputGroup, Tab} from "react-bootstrap";
import CardComponent, {CardComponentField} from "../../../../general-components/CardComponent/CardComponent";

export interface SWOTAlternativeActionsValues extends SwotFactorsValues {

}

interface SWOTAlternativeActionsState {
    isSelected: boolean
    name: string
}

class SWOTAlternativeActions extends FormComponent<SWOTAlternativeActionsValues, SWOTAlternativeActionsState> {
    private factors: SwotFactorsValues | undefined;

    private combis = Array<string>();
    private selectedStrengthOrWeakness: CardComponentField | undefined;
    private selectedChanceOrRisk: CardComponentField | undefined;

    constructor(props: any) {
        super(props);

        this.state = {
            isSelected: false,
            name: ""
        }
    }

    checkIsSelected() {
        if (this.selectedStrengthOrWeakness !== undefined && this.selectedChanceOrRisk !== undefined) {
            let name = this.selectedStrengthOrWeakness.id + "-" + this.selectedChanceOrRisk.id;
            this.setState({isSelected: true, name: name});
        } else {
            this.setState({isSelected: false, name: ""});
        }
    }

    onStrengthOrWeaknessSelect(selectedCard: CardComponentField) {
        this.selectedStrengthOrWeakness = selectedCard;
        this.checkIsSelected();
    }

    onChanceOrRiskSelect(selectedCard: CardComponentField) {
        this.selectedChanceOrRisk = selectedCard;
        this.checkIsSelected();
    }

    resetStrengthOrWeakness(e: FormEvent<HTMLSelectElement>) {
        if (e.currentTarget.value === "none") this.selectedStrengthOrWeakness = undefined;
        this.checkIsSelected();
    }

    resetChanceOrRisk(e: FormEvent<HTMLSelectElement>) {
        if (e.currentTarget.value === "none") this.selectedChanceOrRisk = undefined;
        this.checkIsSelected();
    }

    build(): JSX.Element {
        return (
            <div className={"alternative-actions"}>
                <InputGroup>
                    <Form.Select onChange={(e) => this.resetStrengthOrWeakness(e)}>
                        <option value={"none"}>- Auswählen -</option>
                        {this.factors?.strengths.map((value, index) => {
                            return (
                                <option key={"S" + index} onClick={() => this.onStrengthOrWeaknessSelect(value)}
                                        value={value.name + "|" + value.id}>{value.id + " " + value.name}</option>
                            );
                        })}
                        {this.factors?.weaknesses.map((value, index) => {
                            return (
                                <option key={"W" + index} onClick={() => this.onStrengthOrWeaknessSelect(value)}
                                        value={value.name}>{value.id + " " + value.name}</option>
                            );
                        })}
                    </Form.Select>
                    <Form.Select onChange={(e) => this.resetChanceOrRisk(e)}>
                        <option value={"none"}>- Auswählen -</option>
                        {this.factors?.chances.map((value, index) => {
                            return (
                                <option key={"C" + index} onClick={() => this.onChanceOrRiskSelect(value)}
                                        value={value.name + "|" + value.id}>{value.id + " " + value.name}</option>
                            );
                        })}
                        {this.factors?.risks.map((value, index) => {
                            return (
                                <option key={"R" + index} onClick={() => this.onChanceOrRiskSelect(value)}
                                        value={value.name}>{value.id + " " + value.name}</option>
                            );
                        })}
                    </Form.Select>
                </InputGroup>

                <Tab.Container activeKey={this.state.name}>
                    <Tab.Content>
                        {this.combis.map(value => {
                            return (
                                <Tab.Pane key={"TAB-" + value} eventKey={value}>
                                    <CardComponent
                                        name={value}
                                        disabled={this.disabled}
                                        min={0}
                                        max={10}
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

    prepareValues = async () => {
        this.factors = this.props.stepComp?.getPreviousStep()?.getValues() as SwotFactorsValues;

        if (this.factors !== undefined && this.combis.length <= 0) {
            let weaknesses = this.factors.weaknesses;
            let strengths = this.factors.strengths;
            let chances = this.factors.chances;
            let risks = this.factors.risks;

            for (const item1 of strengths.concat(weaknesses)) {
                for (const item2 of chances.concat(risks)) {
                    this.combis.push(item1.id + "-" + item2.id);
                }
            }
        }

        this.setValues(this.factors);
    }

    submit = async (values: any) => {

    }

    validate(values: any): boolean {
        return false;
    }

}

export default SWOTAlternativeActions;