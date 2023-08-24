import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis-old";
import {Col, Row} from "react-bootstrap";
import {isDesktop} from "../../../../../general-components/Desktop";
import {
    faBook,
    faBug,
    faBullseye,
    faCoffee,
    faCoins,
    faGrinHearts,
    faHospital,
    faSignInAlt
} from "@fortawesome/free-solid-svg-icons/";
import FAE from "../../../../../general-components/Icons/FAE";

export interface PersonaShowValues {

}

export class PersonaShowComponent extends Step<PersonaAnalysisValues, PersonaShowValues> {
    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
    }

    build(): JSX.Element {
        let bedürfnisse = this.props.save.data['persona-factors']?.factors.bedürfnisse.map((b) => {
            return <div>{"• " + b.name}{b.desc}</div>
        })
        let art_der_Erkrankung = this.props.save.data['persona-factors']?.factors.art_der_Erkrankung.map((b) => {
            return <div>{"• " + b.name}{b.desc}</div>
        })
        let beraterOrAngehörige = this.props.save.data['persona-factors']?.factors.beraterOrAngehörige.map((b) => {
            return <div>{"• " + b.name}{b.desc}</div>
        })
        let charaktereigenschaften = this.props.save.data['persona-factors']?.factors.charaktereigenschaften.map((b) => {
            return <div>{"• " + b.name}{b.desc}</div>
        })
        let familieOrFreunde = this.props.save.data['persona-factors']?.factors.familieOrFreunde.map((b) => {
            return <div>{"• " + b.name}{b.desc}</div>
        })
        let hobiese = this.props.save.data['persona-factors']?.factors.hobies.map((b) => {
            return <div>{"• " + b.name}{b.desc}</div>
        })
        let motivation = this.props.save.data['persona-factors']?.factors.motivation.map((b) => {
            return <div>{"• " + b.name}{b.desc}</div>
        })
        let qualifikation = this.props.save.data['persona-factors']?.factors.qualifikation.map((b) => {
            return <div>{"• " + b.name}{b.desc}</div>
        })
        let zitat = this.props.save.data['persona-factors']?.factors.zitat.map((b) => {
            return <div>{"• " + b.name}{b.desc}</div>
        })
        let baseInfoName = this.props.save.data['uploadImage_actions']?.factors.surname + ", " + this.props.save.data['uploadImage_actions']?.factors.name
        let baseInfoAlter = this.props.save.data['uploadImage_actions']?.factors.age == '' ? '' : this.props.save.data['uploadImage_actions']?.factors.age + " Jahre Alt,"
        let baseInfoImg = this.props.save.data['uploadImage_actions']?.factors.avatar
        let imgSrc = baseInfoImg == "" || baseInfoImg == undefined ? "https://img95.699pic.com/xsj/0v/4e/fx.jpg!/fh/300" : baseInfoImg

        return <div>
            <div className={[isDesktop() ? "getBorder" : "getBorderPhone", ''].join(' ')}>

                <Row>
                    <Col className={"childBox langBox"} sm={{span: 2, offset: 0}}>
                        <div className={"head"}>
                            <FAE className={"icons zitatZiel"} icon={faBook}/>Zitat<br/>
                        </div>
                        <div className={"text"}>
                            {zitat}
                        </div>
                    </Col>
                    <Col className={"childBox langBox withoutBorder"} sm={{span: 2, offset: 0}}>
                        <Row>
                            <Col className={"childBox"} sm={{span: 14, offset: 0}}>
                                <div className={"head"}>
                                    <FAE className={"icons hobby"} icon={faCoffee}/> Interessen<br/>/Hobbys<br/>
                                </div>
                                <div className={"text"}>
                                    {hobiese}
                                </div>
                            </Col>

                        </Row>
                        <Row className={"untenChild"}>
                            <Col className={"childBox"} sm={{span: 14, offset: 0}}>
                                <div className={"head"}>
                                    <FAE className={"icons diff"} icon={faCoins}/> Verschiedenes<br/>
                                </div>
                                <div className={"text"}>
                                    {qualifikation}
                                </div>
                            </Col>

                        </Row>
                    </Col>
                    <Col className={"childBox langBox"} sm={{span: 3, offset: 0}}>
                        <img className={[isDesktop() ? "personaBild" : "personaBildPhone", ''].join(' ')} src={imgSrc}/>
                        <Row className={"vollname"}>
                            <Col>{baseInfoName}</Col>
                        </Row>
                        <Row className={"baseInfoItem"}>
                            <Col>{baseInfoAlter}</Col>
                        </Row>

                        <Row className={"baseInfoItem"}>
                            <Col>geschieden,</Col>
                        </Row>
                        <Row className={"baseInfoItem"}>
                            <Col>2 Kinder
                                (15 + 17 Jahre),
                            </Col>
                        </Row>
                        <Row className={"baseInfoItem"}>
                            <Col>Managerin,
                            </Col>
                        </Row>
                        <Row className={"baseInfoItem"}>
                            <Col>PenthouseWohnung,
                            </Col>
                        </Row>
                        <Row className={"baseInfoItem"}>
                            <Col>Audi S5 Cabrio,
                            </Col>
                        </Row>
                    </Col>
                    <Col className={"childBox langBox withoutBorder"} sm={{span: 2, offset: 0}}>
                        <Row>
                            <Col className={"childBox"} sm={{span: 14, offset: 0}}>
                                <div className={"head"}>
                                    <FAE className={"icons zitatZiel"} icon={faBullseye}/>Ziele<br/>/Wünsche<br/>

                                </div>
                                <div className={"text"}>
                                    {motivation}
                                </div>
                            </Col>

                        </Row>
                        <Row className={"untenChild"}>
                            <Col className={"childBox"} sm={{span: 14, offset: 0}}>
                                <div className={"head"}>
                                    <FAE className={"icons prob"} icon={faBug}/>Probleme<br/>
                                </div>
                                <div className={"text"}>
                                    {bedürfnisse}
                                </div>
                            </Col>

                        </Row>
                    </Col>
                    <Col className={"childBox langBox"} sm={{span: 2, offset: 0}}>
                        <div className={"head"}>
                            <FAE className={"icons station"} icon={faHospital}/> Auf Station,<br/> weil…<br/>
                        </div>
                        <div className={"text"}>
                            {art_der_Erkrankung}
                        </div>
                    </Col>

                </Row>

                <Row>
                    <Col className={"childBox descriptBox"} sm={{span: 8, offset: 0}}>
                        <div className={"head"}>
                            <FAE className={"icons motiv"} icon={faGrinHearts}/> Welches ist das dominierende
                            Motiv?<br/>
                            Wie lässt sich dies erklären?<br/>
                        </div>
                        <div className={"text"}>
                            {zitat}
                        </div>
                    </Col>
                    <Col className={"childBox descriptBox"} sm={{span: 8, offset: 0}}>
                        <div className={"head"}>
                            <FAE className={"icons extra"} icon={faSignInAlt}/>Wie lässt sich die Persona
                            in ein / zwei Sätzen,<br/>
                            ein/ zwei Schlagworten beschreiben?<br/>
                        </div>
                        <div className={"text"}>
                            {charaktereigenschaften}
                        </div>
                    </Col>
                </Row>

            </div>
        </div>
    }
}