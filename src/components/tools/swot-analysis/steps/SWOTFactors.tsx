import {
    FormComponent,
    FormComponentProps,
    ResetType
} from "../../../../general-components/Tool/FormComponent/FormComponent";
import React, {FormEvent} from "react";
import {CardComponent, CardComponentFields} from "../../../../general-components/CardComponent/CardComponent";
import {extractCardComponentField} from "../../../../general-components/FormHelper";
import {Accordion} from "react-bootstrap";
import {NumberCounter} from "../../../../general-components/Counter/NumberCounter";
import {RomanNumeralsCounter} from "../../../../general-components/Counter/RomanNumeralsCounter";
import {LowerABCCounter} from "../../../../general-components/Counter/LowerABCCounter";
import {UpperABCCounter} from "../../../../general-components/Counter/UpperABCCounter";
import {isDesktop} from "../../../../general-components/Desktop";
import {Step, SteppableProp} from "../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";


export interface SwotFactorsValues {
    factors: {
        chances: CardComponentFields
        risks: CardComponentFields
        strengths: CardComponentFields
        weaknesses: CardComponentFields
    }
}

interface SWOTFactorsState {
    collapseAll: boolean
}

export class SWOTFactors extends Step<SwotFactorsValues, SWOTFactorsState> {
    private cardComponentRefs = new Map<string, React.RefObject<CardComponent>>();

    constructor(props: FormComponentProps & SteppableProp, context: any) {
        super(props, context);
        this.state = {
            collapseAll: false
        }
    }

    extractValues(e: FormEvent<HTMLFormElement>): SwotFactorsValues {
        let chances: CardComponentFields = extractCardComponentField(e, "chances") as CardComponentFields;
        let risks: CardComponentFields = extractCardComponentField(e, "risks") as CardComponentFields;
        let strengths: CardComponentFields = extractCardComponentField(e, "strengths") as CardComponentFields;
        let weaknesses: CardComponentFields = extractCardComponentField(e, "weaknesses") as CardComponentFields;

        return {
            factors: {
                chances: chances,
                risks: risks,
                strengths: strengths,
                weaknesses: weaknesses
            }
        }
    }

    rebuildValues = async (values: SwotFactorsValues) => {
    }

    buildPreviousValues = async () => {
    }

    onReset = (type: ResetType) => {
        this.collapseAll(false);
    }

    submit = async (values: SwotFactorsValues) => {
    }

    // Override
    setDisabled = (disabled: boolean) => {
        this.disabled = disabled;
        this.collapseAll(true);
    };

    collapseAll(collapse: boolean) {
        this.setState({
            collapseAll: collapse
        });
    }

    validate(values: SwotFactorsValues): boolean {
        let validate = true;
        const errorText = (text: string) => `Bitte füllen Sie alle ${text} aus!`;

        if (this.cardComponentRefs.get("strengths")?.current?.hasInvalidValue()) {
            this.addError("strengthsError", errorText("Stärken"));
            validate = false;
        }
        if (this.cardComponentRefs.get("weaknesses")?.current?.hasInvalidValue()) {
            this.addError("weaknessesError", errorText("Schwächen"));
            validate = false;
        }
        if (this.cardComponentRefs.get("chances")?.current?.hasInvalidValue()) {
            this.addError("chancesError", errorText("Chancen"));
            validate = false;
        }
        if (this.cardComponentRefs.get("risks")?.current?.hasInvalidValue()) {
            this.addError("risksError", errorText("Risiken"));
            validate = false;
        }

        if (!validate) {
            this.collapseAll(true);
        }

        return validate;
    }

    buildCardComponentRefs() {
        if (this.cardComponentRefs.size <= 0) {
            this.cardComponentRefs.set("strengths", React.createRef<CardComponent>());
            this.cardComponentRefs.set("weaknesses", React.createRef<CardComponent>());
            this.cardComponentRefs.set("chances", React.createRef<CardComponent>());
            this.cardComponentRefs.set("risks", React.createRef<CardComponent>());
        }
    }

    build(): JSX.Element {
        let min = 2;
        let max = 8;
        let activeKey = "view";

        let numberCounter = new NumberCounter();
        let romanNumeralCounter = new RomanNumeralsCounter();
        let upperABCCounter = new UpperABCCounter();
        let lowerABCCounter = new LowerABCCounter();

        let values = (this.values as SwotFactorsValues).factors;
        this.buildCardComponentRefs();

        return (
            <div className={"swot-factors"}>
                <Accordion flush={true} activeKey={this.state.collapseAll ? activeKey : undefined}
                           defaultActiveKey={isDesktop() ? "strengths" : undefined}>
                    <Accordion.Item eventKey={this.state.collapseAll ? activeKey : "strengths"}>
                        <Accordion.Header>{upperABCCounter.get(1) + "-" + upperABCCounter.get(max)} -
                            Stärken (Interne Faktoren)</Accordion.Header>
                        <Accordion.Body>
                            <CardComponent required={false} values={values?.strengths}
                                           ref={this.cardComponentRefs.get("strengths")}
                                           counter={upperABCCounter} name={"strengths"}
                                           disabled={this.disabled}
                                           min={min} max={max}/>
                            {this.getError("strengthsError")}
                        </Accordion.Body>
                    </Accordion.Item>

                    <Accordion.Item eventKey={this.state.collapseAll ? activeKey : "weaknesses"}>
                        <Accordion.Header>{lowerABCCounter.get(1) + "-" + lowerABCCounter.get(max)} -
                            Schwächen (Interne Faktoren)</Accordion.Header>
                        <Accordion.Body>
                            <CardComponent required={false} values={values?.weaknesses}
                                           ref={this.cardComponentRefs.get("weaknesses")}
                                           counter={lowerABCCounter} name={"weaknesses"}
                                           disabled={this.disabled}
                                           min={min} max={max}/>
                            {this.getError("weaknessesError")}
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={this.state.collapseAll ? activeKey : "chances"}>
                        <Accordion.Header>{numberCounter.get(1) + "-" + numberCounter.get(max)} -
                            Chancen (Externe Faktoren)</Accordion.Header>
                        <Accordion.Body>
                            <CardComponent required={false} values={values?.chances}
                                           ref={this.cardComponentRefs.get("chances")}
                                           counter={numberCounter} name={"chances"}
                                           disabled={this.disabled}
                                           min={min} max={max}/>
                            {this.getError("chancesError")}
                        </Accordion.Body>
                    </Accordion.Item>
                    <Accordion.Item eventKey={this.state.collapseAll ? activeKey : "risks"}>
                        <Accordion.Header>{romanNumeralCounter.get(1) + "-" + romanNumeralCounter.get(max)} -
                            Risiken (Externe Faktoren)</Accordion.Header>
                        <Accordion.Body>
                            <CardComponent required={false} values={values?.risks}
                                           ref={this.cardComponentRefs.get("risks")}
                                           counter={romanNumeralCounter} name={"risks"}
                                           disabled={this.disabled}
                                           min={min} max={max}/>
                            {this.getError("risksError")}
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>

            </div>
        );
    }

    changeControlFooter(): void {
    }

}
