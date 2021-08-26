import FormComponent from "../../../../general-components/Form/FormComponent";
import {FormEvent} from "react";
import CardComponent, {CardComponentFields} from "../../../../general-components/CardComponent/CardComponent";
import {extractCardComponentField} from "../../../../general-components/FormHelper";
import {Accordion} from "react-bootstrap";
import NumberCounter from "../../../../general-components/Counter/NumberCounter";
import RomanNumeralsCounter from "../../../../general-components/Counter/RomanNumeralsCounter";
import LowerABCCounter from "../../../../general-components/Counter/LowerABCCounter";
import UpperABCCounter from "../../../../general-components/Counter/UpperABCCounter";
import {isDesktop} from "../../../../general-components/Desktop";

export interface SwotFactorsValues {
    chances: CardComponentFields
    risks: CardComponentFields
    strengths: CardComponentFields
    weaknesses: CardComponentFields
}

class SWOTFactors extends FormComponent<SwotFactorsValues, any> {

    extractValues(e: FormEvent<HTMLFormElement>): SwotFactorsValues {
        let chances: CardComponentFields = extractCardComponentField(e, "chances") as CardComponentFields;
        let risks: CardComponentFields = extractCardComponentField(e, "risks") as CardComponentFields;
        let strengths: CardComponentFields = extractCardComponentField(e, "strengths") as CardComponentFields;
        let weaknesses: CardComponentFields = extractCardComponentField(e, "weaknesses") as CardComponentFields;

        return {
            chances: chances,
            risks: risks,
            strengths: strengths,
            weaknesses: weaknesses
        }
    }

    prepareValues = async () => {
    }

    submit = async (values: SwotFactorsValues) => {
    }

    validate(values: SwotFactorsValues): boolean {
        return true;
    }

    build(): JSX.Element {
        let min = 0;
        let max = 10;
        let activeKey = "view";

        let numberCounter = new NumberCounter();
        let romanNumeralCounter = new RomanNumeralsCounter();
        let upperABCCounter = new UpperABCCounter();
        let lowerABCCounter = new LowerABCCounter();

        return (
            <div className={"swot-factors"}>
                <Accordion activeKey={this.disabled ? activeKey : undefined}
                           defaultActiveKey={isDesktop() ? "strengths" : undefined}>
                    <Accordion.Item eventKey={this.disabled ? activeKey : "strengths"}>
                        <Accordion.Header>{upperABCCounter.get(1) + "-" + upperABCCounter.get(max)} - Stärken</Accordion.Header>
                        <Accordion.Body>
                            <CardComponent counter={upperABCCounter} name={"strengths"} disabled={this.disabled}
                                           min={min} max={max}/>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey={this.disabled ? activeKey : "weaknesses"}>
                        <Accordion.Header>{lowerABCCounter.get(1) + "-" + lowerABCCounter.get(max)} - Schwächen</Accordion.Header>
                        <Accordion.Body>
                            <CardComponent counter={lowerABCCounter} name={"weaknesses"} disabled={this.disabled}
                                           min={min} max={max}/>
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={this.disabled ? activeKey : "chances"}>
                        <Accordion.Header>{numberCounter.get(1) + "-" + numberCounter.get(max)} - Chancen</Accordion.Header>
                        <Accordion.Body>
                            <CardComponent counter={numberCounter} name={"chances"} disabled={this.disabled}
                                           min={min} max={max}/>
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey={this.disabled ? activeKey : "risks"}>
                        <Accordion.Header>{romanNumeralCounter.get(1) + "-" + romanNumeralCounter.get(max)} - Risiken</Accordion.Header>
                        <Accordion.Body>
                            <CardComponent counter={romanNumeralCounter} name={"risks"} disabled={this.disabled}
                                           min={min} max={max}/>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        );
    }

}

export default SWOTFactors;