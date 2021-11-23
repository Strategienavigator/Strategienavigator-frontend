import {Component} from "react";
import {Col, Nav, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faBalanceScale, faCog, faInfoCircle, faShieldAlt} from "@fortawesome/free-solid-svg-icons";

import "./footer.scss";
import {isDesktop} from "../../../general-components/Desktop";


class Footer extends Component<any, any> {

    render() {
        return (
            <Nav as={"footer"} className={(isDesktop() ? "show" : "")}>
                <Row className={"container pt-2 pb-2 m-auto justify-content-center align-items-center w-100"}>
                    <Col className={"text-center"}>
                        <NavLink to={"/about-us"} className={"nav-link"}>
                            <FontAwesomeIcon icon={faInfoCircle}/>&nbsp;Über uns
                        </NavLink>
                    </Col>
                    <Col className={"text-center"}>
                        <NavLink to={"/legal-notice"} className={"nav-link"}>
                            <FontAwesomeIcon icon={faBalanceScale}/>&nbsp;Impressum
                        </NavLink>
                    </Col>
                    <Col className={"text-center"}>
                        <NavLink to={"/data-privacy"} className={"nav-link"}>
                            <FontAwesomeIcon icon={faShieldAlt}/>&nbsp;Datenschutz
                        </NavLink>
                    </Col>
                    <Col className={"text-center"}>
                        <NavLink to={"/settings"} className={"nav-link"}>
                            <FontAwesomeIcon icon={faCog}/>&nbsp;Einstellungen
                        </NavLink>
                    </Col>
                </Row>
            </Nav>
        );
    }
}

export default Footer;
