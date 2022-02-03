import React from "react";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {Accordion} from "react-bootstrap";
import {NumberCounter} from "../../../../../general-components/Counter/NumberCounter";
import {RomanNumeralsCounter} from "../../../../../general-components/Counter/RomanNumeralsCounter";
import {LowerABCCounter} from "../../../../../general-components/Counter/LowerABCCounter";
import {UpperABCCounter} from "../../../../../general-components/Counter/UpperABCCounter";
import {isDesktop} from "../../../../../general-components/Desktop";
import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {SWOTAnalysisValues} from "../../SWOTAnalysis";
import {SWOTFactors} from "./SWOTFactors";


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

export class SWOTFactorsComponent extends Step<SWOTAnalysisValues, SWOTFactorsState> {

    private static min = 2;
    private static max = 8;

    constructor(props: StepProp<SWOTAnalysisValues>, context: any) {
        super(props, context);
        this.state = {
            collapseAll: false
        }
    }

    collapseAll(collapse: boolean) {
        this.setState({
            collapseAll: collapse
        });
    }

    private applyCardComponentChanges(type: "strengths" | "weaknesses" | "chances" | "risks", values: CardComponentFields) {
        const save = this.props.save;
        const data = save.data["swot-factors"];
        if(data !== undefined){
            switch (type) {
                case "strengths":
                    data.factors.strengths = values;
                    break;
                case "weaknesses":
                    data.factors.weaknesses = values;
                    break;
                case "chances":
                    data.factors.chances = values;
                    break;
                case "risks":
                    data.factors.risks = values;
            }


            save.data["swot-factors"] = data;
            this.props.saveController.onChanged(save);
        }
    }

    build(): JSX.Element {
        const min = SWOTFactors.min;
        const max = SWOTFactors.max;
        let activeKey = "view";

        let numberCounter = new NumberCounter();
        let romanNumeralCounter = new RomanNumeralsCounter();
        let upperABCCounter = new UpperABCCounter();
        let lowerABCCounter = new LowerABCCounter();

        let values = this.props.save.data["swot-factors"]?.factors;
        if (values !== undefined) {
            return (
                <div className={"swot-factors"}>
                    <Accordion flush={true} activeKey={this.state.collapseAll ? activeKey : undefined}
                               defaultActiveKey={isDesktop() ? "strengths" : undefined}>
                        <Accordion.Item eventKey={this.state.collapseAll ? activeKey : "strengths"}>
                            <Accordion.Header>{upperABCCounter.get(1) + "-" + upperABCCounter.get(max)} -
                                Stärken (Interne Faktoren)</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values?.strengths}
                                               counter={upperABCCounter}
                                               name={"strengths"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.applyCardComponentChanges.bind(this, "strengths")}/>
                                {/*{this.getError("strengthsError")}*/}
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey={this.state.collapseAll ? activeKey : "weaknesses"}>
                            <Accordion.Header>{lowerABCCounter.get(1) + "-" + lowerABCCounter.get(max)} -
                                Schwächen (Interne Faktoren)</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values.weaknesses}
                                               counter={lowerABCCounter}
                                               name={"weaknesses"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.applyCardComponentChanges.bind(this,"weaknesses")}/>
                                {/*{this.getError("weaknessesError")}*/}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey={this.state.collapseAll ? activeKey : "chances"}>
                            <Accordion.Header>{numberCounter.get(1) + "-" + numberCounter.get(max)} -
                                Chancen (Externe Faktoren)</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values.chances}
                                               counter={numberCounter}
                                               name={"chances"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.applyCardComponentChanges.bind(this,"chances")}/>
                                {/*{this.getError("chancesError")}*/}
                            </Accordion.Body>
                        </Accordion.Item>
                        <Accordion.Item eventKey={this.state.collapseAll ? activeKey : "risks"}>
                            <Accordion.Header>{romanNumeralCounter.get(1) + "-" + romanNumeralCounter.get(max)} -
                                Risiken (Externe Faktoren)</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values?.risks}
                                               counter={romanNumeralCounter}
                                               name={"risks"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.applyCardComponentChanges.bind(this,"risks")}/>
                                {/*{this.getError("risksError")}*/}
                            </Accordion.Body>
                        </Accordion.Item>
                    </Accordion>

                </div>
            );
        }

        return <p>"ERROR"</p>; // TODO


    }

    changeControlFooter(): void {
    }

}
