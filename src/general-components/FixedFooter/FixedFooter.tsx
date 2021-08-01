import React, {Component} from "react";
import {Col, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faHome} from "@fortawesome/free-solid-svg-icons/faHome";
import {faCaretRight} from "@fortawesome/free-solid-svg-icons/faCaretRight";

import "./fixed-footer.scss";
import {IconProp} from "@fortawesome/fontawesome-svg-core";
import {faPlusSquare} from "@fortawesome/free-solid-svg-icons/faPlusSquare";
import {faCogs} from "@fortawesome/free-solid-svg-icons/faCogs";
import {faFileExport} from "@fortawesome/free-solid-svg-icons";

export interface FooterToolProps {
    icon: IconProp
    title: string
    link: string
}

export interface FooterNewToolProps {
    title: string
    link: string
}

export interface FooterStepProps {
    onNextStep: (e: any) => void
}


interface FixedFooterProps {
    home?: boolean
    settings?: boolean
    exportAndShare?: boolean
    nextStep?: FooterStepProps
    tool?: FooterToolProps
    newTool?: FooterNewToolProps
}

class FixedFooter extends Component<FixedFooterProps, any> {
    render() {
        return (
            <Row as={"footer"}
                 className={"nav fixed container p-0 pt-3 pb-3 m-auto justify-content-center align-items-center"}>
                {(this.props.home) && (
                    <Col as={NavLink} to={"/"} exact className={"text-center"}>
                        <FontAwesomeIcon icon={faHome}/> Startseite
                    </Col>
                )}

                {(this.props.tool) && (
                    <Col as={NavLink} to={this.props.tool?.link} exact className={"text-center"}>
                        <FontAwesomeIcon icon={this.props.tool?.icon}/> {this.props.tool?.title}
                    </Col>
                )}

                {(this.props.newTool) && (
                    <Col as={NavLink} to={this.props.newTool?.link} exact className={"text-center"}>
                        <FontAwesomeIcon icon={faPlusSquare}/> {this.props.newTool?.title}
                    </Col>
                )}

                {(this.props.settings) && (
                    <Col as={NavLink} to={"/settings"} exact className={"text-center"}>
                        <FontAwesomeIcon icon={faCogs}/> Einstellungen
                    </Col>
                )}

                {(this.props.exportAndShare) && (
                    <Col className={"text-center"}>
                        <FontAwesomeIcon icon={faFileExport}/> Exportieren/Teilen
                    </Col>
                )}

                {(this.props.nextStep) && (
                    <Col className={"text-center"}>
                        <div onClick={(e) => {
                            this.props.nextStep?.onNextStep(e);
                        }}>
                            <FontAwesomeIcon icon={faCaretRight}/> Weiter
                        </div>
                    </Col>
                )}

            </Row>
        );
    }
}

// TODO: footer implementieren (deskstop)
// <Nav as={"footer"} style={{backgroundColor: "#fff", position: "fixed", bottom: 0, left: 0, width: "100%"}}>
//     <Row className={"container pt-2 pb-2 m-auto justify-content-center align-items-center w-100"}>
//         <Col className={"text-center"}>
//             <NavLink to={"/legal-notice"} className={"nav-link"}>Über üns</NavLink>
//         </Col>
//         <Col className={"text-center"}>
//             <NavLink to={"/legal-notice"} className={"nav-link"}>Impressum</NavLink>
//         </Col>
//         <Col className={"text-center"}>
//             <NavLink to={"/legal-notice"} className={"nav-link"}>Datenschutz</NavLink>
//         </Col>
//         <Col sm={12} className={"text-left"}>
//             @ Strategietools
//         </Col>
//     </Row>
// </Nav>

export default FixedFooter;
