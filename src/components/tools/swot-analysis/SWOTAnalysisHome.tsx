import React, {Component} from "react";
import {ToolFrontpage} from "../../../general-components/Tool/Frontpage/ToolFrontpage";
import {Button, Offcanvas, OffcanvasBody, OffcanvasHeader} from "react-bootstrap";
import {isDesktop} from "../../../general-components/Desktop";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export interface SWOTAnalysisHomeState {
    show: boolean
}

export class SWOTAnalysisHome extends Component<any, SWOTAnalysisHomeState> {

    constructor(props: any) {
        super(props);

        this.state = {
            show: false
        }
    }

    render() {
        return (
            <ToolFrontpage
                tool={1}
                link={"/swot-analysis"}
            >
                <h4>SWOT Analyse</h4>

                <hr />

                {isDesktop() ? this.getDescriptionText() : this.getDescription()}
            </ToolFrontpage>
        );
    }

    getDescription() {
        return (
            <>
                <Button className={"description"} variant={"dark"}
                        onClick={() => this.setState({show: true})}>
                    <FontAwesomeIcon icon={faInfoCircle} /> &nbsp;Erklärung
                </Button>

                <Offcanvas show={this.state.show}>
                    <OffcanvasHeader closeButton onClick={() => this.setState({show: false})}>
                        <Offcanvas.Title>SWOT-Analyse</Offcanvas.Title>
                    </OffcanvasHeader>
                    <OffcanvasBody>
                        {this.getDescriptionText()}
                    </OffcanvasBody>
                </Offcanvas>
            </>
        );
    }

    getDescriptionText() {
        return (
            <p>Eine gute SWOT-Analyse kombiniert sowohl <b>interne Einflussfaktoren</b> als auch <b>externe
                Einflussfaktoren</b>.
                Interne Einflussfaktoren zeichnen sich in erster Linie dadurch aus, dass sie sich direkt durch
                das Unternehmen beeinflussen lassen. Folglich spricht man hier auch
                von <b>"Stärken"</b> und <b>"Schwächen"</b>.
                Beispiele hierzu wären ein besonders guter Kundenservice oder eine besonders hohe Mitareitermotivation.
                Externe Einflussfaktoren bezeichnen dahingegen <b>"Chancen"</b> und <b>"Risiken"</b>, welche sich nicht
                durch
                das Unternehmen beeinflussen lassen und demzufolge auf eine gesamte Branche oder sogar Markt einwirken.
                Hierzu gehören zum Beispiel Faktoren wie der Klimawandel oder der Digitalisierungsschub durch die
                Corona-Pandemie.
            </p>
        )
    }

}
