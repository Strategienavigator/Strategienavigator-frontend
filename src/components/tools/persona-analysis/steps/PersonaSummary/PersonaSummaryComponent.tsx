import React from "react";
import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {Col, Image, Row} from "react-bootstrap";
import {faBrain, faPaintRoller, faSmile, faUsers} from "@fortawesome/free-solid-svg-icons";
import {PersonaInfoItem} from "./PersonaInfoItem";
import {faBook, faBullseye, faCoins, faHospital} from "@fortawesome/free-solid-svg-icons/";


export type PersonaSummaryValues = null | undefined;

export class PersonaSummaryComponent extends Step<PersonaAnalysisValues, {}> {

    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
    }

    build(): JSX.Element {
        let info = this.props.save.data["persona-info"];
        let personality = this.props.save.data["persona-personality"];

        if (info && personality) {
            return (
                <>
                    <Row>
                        <Col sm={5}>
                            <div className={"avatar-container"}>
                                <Image className={"avatar"} rounded src={info.avatar ?? undefined}/>
                            </div>

                            <div className={"names"}>
                                {info.firstname} {info.lastname}, {info.age} {info.age === 1 ? "Jahr" : "Jahre"} alt
                            </div>

                            <PersonaInfoItem icon={faHospital} items={personality.illness}
                                             title={"Auf der Krankenstation wegen..."}/>
                            <PersonaInfoItem icon={faBook} items={personality.citations} title={"Zitat"}/>
                            <PersonaInfoItem icon={faSmile} items={personality.motives}
                                             title={"Welches Grundmotiv verfolgt dieses Persona und warum?"}/>
                        </Col>
                        <Col sm={7}>
                            <PersonaInfoItem icon={faUsers} items={personality.family} title={"Familie und Freunde"}/>
                            <PersonaInfoItem icon={faPaintRoller} items={personality.hobbys}
                                             title={"Hobbys und Interessen"}/>
                            <PersonaInfoItem icon={faBullseye} items={personality.wishes} title={"Ziele und Wünsche"}/>
                            <PersonaInfoItem icon={faBrain} items={personality.characteristics}
                                             title={"Wie lässt sich das Persona in Stichworten beschreiben?"}/>
                            <PersonaInfoItem icon={faCoins} items={personality.problems}
                                             title={"Welche Probleme und Hürden muss dieses Persona bewältigen?"}/>
                        </Col>
                    </Row>
                </>
            );
        }
        return <></>;
    }

}
