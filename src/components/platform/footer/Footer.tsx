import {Col, Nav, Row} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {faBalanceScale, faCog, faInfoCircle, faShieldAlt} from "@fortawesome/free-solid-svg-icons";

import "./footer.scss";
import {isDesktop} from "../../../general-components/Desktop";
import FAE from "../../../general-components/Icons/FAE";


const Footer = function footerComponent() {
    return (
        <Nav as={"footer"} className={(isDesktop() ? "show" : "")}>
            <Row className={"container pt-2 pb-2 m-auto justify-content-center align-items-center w-100"}>
                <Col className={"text-center"}>
                    <NavLink to={"/about-us"} className={"nav-link"}>
                        <FAE icon={faInfoCircle}/>&nbsp;Über uns
                    </NavLink>
                </Col>
                <Col className={"text-center"}>
                    <NavLink to={"/legal-notice"} className={"nav-link"}>
                        <FAE icon={faBalanceScale}/>&nbsp;Impressum
                    </NavLink>
                </Col>
                <Col className={"text-center"}>
                    <NavLink to={"/data-privacy"} className={"nav-link"}>
                        <FAE icon={faShieldAlt}/>&nbsp;Datenschutz
                    </NavLink>
                </Col>
                <Col className={"text-center"}>
                    <NavLink to={"/settings"} className={"nav-link"}>
                        <FAE icon={faCog}/>&nbsp;Einstellungen
                    </NavLink>
                </Col>
            </Row>
        </Nav>
    );
}

export default Footer;
