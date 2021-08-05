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
import {faSave} from "@fortawesome/free-solid-svg-icons/";

export interface FooterToolProps {
    icon: IconProp
    title: string
    link: string
}

export interface FooterNewToolProps {
    title: string
    link: string
}

interface FixedFooterProps {
    home?: boolean
    settings?: boolean
    saveTool?: string
    nextStep?: string
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

                {(this.props.saveTool) && (
                    <Col className={"text-center"}>
                        <button className={"btn-transparent"} form={this.props.saveTool} type={"submit"}>
                            <FontAwesomeIcon icon={faSave}/> Speichern
                        </button>
                    </Col>
                )}

                {(this.props.nextStep) && (
                    <Col className={"text-center"}>
                        <button className={"btn-transparent"} form={this.props.nextStep} type={"submit"}>
                            <FontAwesomeIcon icon={faCaretRight}/> Weiter
                        </button>
                    </Col>
                )}

            </Row>
        );
    }
}

export default FixedFooter;
