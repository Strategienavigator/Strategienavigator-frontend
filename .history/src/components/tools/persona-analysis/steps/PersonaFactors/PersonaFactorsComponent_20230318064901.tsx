import React from "react";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {Accordion} from "react-bootstrap";
import {isDesktop} from "../../../../../general-components/Desktop";
import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {PersonaFactors} from "./PersonaFactors";
import {showErrorPage} from "../../../../../index";
import {IUIErrorContext} from "../../../../../general-components/Contexts/UIErrorContext/UIErrorContext";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import { Persona } from "../../../../platform/persona/Persona";


export interface PersonaFactorsValues {
    factors: {
        qualifikation: CardComponentFields
        art_der_Erkrankung: CardComponentFields
        beraterOrAngehörige: CardComponentFields
        familieOrFreunde: CardComponentFields
        charaktereigenschaften: CardComponentFields
        bedürfnisse: CardComponentFields
        hobies: CardComponentFields
        motivation: CardComponentFields
        zitat: CardComponentFields
    
    }
}

interface PersonaFactorsState {

}

export class PersonaFactorsComponent extends Step<PersonaAnalysisValues, PersonaFactorsState> {

    private qualifikationChanged = this.applyCardComponentChanges.bind(this, "qualifikation");
    private art_der_ErkrankungChanged = this.applyCardComponentChanges.bind(this, "art_der_Erkrankung");
    private beraterOrAngehörigeChanged=this.applyCardComponentChanges.bind(this, "beraterOrAngehörige");
    private familieOrFreundeChanged=this.applyCardComponentChanges.bind(this, "familieOrFreunde");
    private charaktereigenschaftenChanged=this.applyCardComponentChanges.bind(this, "charaktereigenschaften");
    private bedürfnisseChanged=this.applyCardComponentChanges.bind(this, "bedürfnisse");
    private hobiesChanged=this.applyCardComponentChanges.bind(this, "hobies");
    private motivationChanged=this.applyCardComponentChanges.bind(this, "motivation");
    private zitatChanged=this.applyCardComponentChanges.bind(this, "zitat");

    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
        console.log('factors.props',this.props)
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<PersonaAnalysisValues>>, nextState: Readonly<PersonaFactorsState>, nextContext: IUIErrorContext): boolean {
        let shouldUpdate: boolean;
        shouldUpdate = !shallowCompareStepProps(this.props, nextProps);
        if (!shouldUpdate) {
            const oldSave = this.props.save;
            const newSave = nextProps.save;
            if (oldSave.data["persona-factors"] !== newSave.data["persona-factors"]) {
                shouldUpdate = true;
            }
        }
        return shouldUpdate;
    }

    build(): JSX.Element {
        const min = PersonaFactors.min;
        const max = PersonaFactors.max;
        let activeKey = "view";

        let values = this.props.save.data["persona-factors"]?.factors;
        if (values !== undefined) {
            return (
                <div className={"persona-factors"}>
                    <Accordion flush={true} activeKey={this.props.validationFailed ? activeKey : undefined}
                               defaultActiveKey={isDesktop() ? "qualifikation" : undefined}>
                        <Accordion.Item eventKey={this.props.validationFailed ? activeKey : "qualifikation"}>
                            <Accordion.Header>{PersonaFactors.qualifikationCounter.get(1) + "-" + PersonaFactors.qualifikationCounter.get(max)} -
                            Qualifikation</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values.qualifikation}
                                               counter={PersonaFactors.qualifikationCounter}
                                               name={"qualifikation"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.qualifikationChanged}/>
                                <UIErrorBanner id={"persona-analysis.qualifikationError"}/>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey={this.props.validationFailed ? activeKey : "art_der_Erkrankung"}>
                            <Accordion.Header>{PersonaFactors.art_der_ErkrankungCounter.get(1) + "-" + PersonaFactors.art_der_ErkrankungCounter.get(max)} -
                            Art_der_Erkrankung</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values.art_der_Erkrankung}
                                               counter={PersonaFactors.art_der_ErkrankungCounter}
                                               name={"art_der_Erkrankung"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.art_der_ErkrankungChanged}/>
                                <UIErrorBanner id={"persona-analysis.art_der_ErkrankungError"}/>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey={this.props.validationFailed ? activeKey : "beraterOrAngehörige"}>
                            <Accordion.Header>{PersonaFactors.beraterOrAngehörigeCounter.get(1) + "-" + PersonaFactors.beraterOrAngehörigeCounter.get(max)} -
                            Berater oder Angehörige</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values.beraterOrAngehörige}
                                               counter={PersonaFactors.beraterOrAngehörigeCounter}
                                               name={"beraterOrAngehörige"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.beraterOrAngehörigeChanged}/>
                                <UIErrorBanner id={"persona-analysis.beraterOrAngehörige"}/>
                            </Accordion.Body>
                        </Accordion.Item>

                        
                        <Accordion.Item eventKey={this.props.validationFailed ? activeKey : "familieOrFreunde"}>
                            <Accordion.Header>{PersonaFactors.familieOrFreundeCounter.get(min) + "-" + PersonaFactors.familieOrFreundeCounter.get(max)} -
                            Familie oder Freunde</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values.familieOrFreunde}
                                               counter={PersonaFactors.familieOrFreundeCounter}
                                               name={"familieOrFreunde"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.familieOrFreundeChanged}/>
                                <UIErrorBanner id={"persona-analysis.familieOrFreunde"}/>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey={this.props.validationFailed ? activeKey : "charaktereigenschaften"}>
                            <Accordion.Header>{PersonaFactors.charaktereigenschaftenCounter.get(1) + "-" + PersonaFactors.charaktereigenschaftenCounter.get(max)} -
                            Charaktereigenschaften</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values.charaktereigenschaften}
                                               counter={PersonaFactors.charaktereigenschaftenCounter}
                                               name={"charaktereigenschaften"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.charaktereigenschaftenChanged}/>
                                <UIErrorBanner id={"persona-analysis.charaktereigenschaften"}/>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey={this.props.validationFailed ? activeKey : "bedürfnisse"}>
                            <Accordion.Header>{PersonaFactors.bedürfnisseCounter.get(1) + "-" + PersonaFactors.bedürfnisseCounter.get(max)} -
                            Bedürfnisse</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values.bedürfnisse}
                                               counter={PersonaFactors.bedürfnisseCounter}
                                               name={"bedürfnisse"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.bedürfnisseChanged}/>
                                <UIErrorBanner id={"persona-analysis.bedürfnisse"}/>
                            </Accordion.Body>
                        </Accordion.Item>

                       <Accordion.Item eventKey={this.props.validationFailed ? activeKey : "hobies"}>
                            <Accordion.Header>{PersonaFactors.hobiesCounter.get(1) + "-" + PersonaFactors.hobiesCounter.get(max)} -
                            Hobies</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values.hobies}
                                               counter={PersonaFactors.hobiesCounter}
                                               name={"hobies"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.hobiesChanged}/>
                                <UIErrorBanner id={"persona-analysis.hobies"}/>
                            </Accordion.Body>
                        </Accordion.Item>

                         <Accordion.Item eventKey={this.props.validationFailed ? activeKey : "motivation"}>
                            <Accordion.Header>{PersonaFactors.motivationCounter.get(1) + "-" + PersonaFactors.motivationCounter.get(max)} -
                            Motivation</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values.motivation}
                                               counter={PersonaFactors.motivationCounter}
                                               name={"motivation"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.motivationChanged}/>
                                <UIErrorBanner id={"persona-analysis.motivation"}/>
                            </Accordion.Body>
                        </Accordion.Item>

                        <Accordion.Item eventKey={this.props.validationFailed ? activeKey :"zitat"}>
                            <Accordion.Header>{PersonaFactors.zitatCounter.get(1) + "-" + PersonaFactors.zitatCounter.get(max)} -
                            Zitat</Accordion.Header>
                            <Accordion.Body>
                                <CardComponent required={false}
                                               values={values.zitat}
                                               counter={PersonaFactors.zitatCounter}
                                               name={"zitat"}
                                               disabled={this.props.disabled}
                                               min={min}
                                               max={max}
                                               onChanged={this.zitatChanged}/>
                                <UIErrorBanner id={"persona-analysis.zitat"}/>
                            </Accordion.Body>
                        </Accordion.Item> 

                    </Accordion>

                    <UIErrorBanner id={"persona-analysis.too-long"}/>
                </div>
            );
        }

        showErrorPage(404);
        return <p>"ERROR"</p>;


    }

    private applyCardComponentChanges(type: String , values: any) {
        this.props.saveController.onChanged(save => {
            const data = save.data["persona-factors"];
            if (data !== undefined) {
                switch (type) {
                    case "qualifikation":
                        data.factors.qualifikation = values;
                        break;
                    case "art_der_Erkrankung":
                        data.factors.art_der_Erkrankung = values;
                        break;
                    case "beraterOrAngehörige":
                        data.factors.beraterOrAngehörige = values;
                        break;
                    case "familieOrFreunde":
                         data.factors.familieOrFreunde = values;
                        break;
                    case "charaktereigenschaften":
                        data.factors.charaktereigenschaften = values;
                        break;
                    case "bedürfnisse":
                        data.factors.bedürfnisse = values;
                            break;
                    case "hobies":
                        data.factors.hobies = values;
                            break;
                    case "motivation":
                        data.factors.motivation = values;
                        break;
                    case "zitat":
                        data.factors.zitat = values;
                        break;
                }
            }
        });
    }

}
