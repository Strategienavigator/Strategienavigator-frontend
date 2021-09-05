import {Component} from "react";
import {Container, Dropdown, Nav as BootstrapNav, Navbar, NavDropdown} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {
    faBalanceScale,
    faCog,
    faHome,
    faShieldAlt,
    faSignInAlt,
    faSignOutAlt,
    faUser,
    faUserPlus
} from "@fortawesome/free-solid-svg-icons/";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {Session} from "../../../general-components/Session/Session";
import {isDesktop} from "../../../general-components/Desktop";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";

import "./nav.scss";

interface NavState {
    expanded: boolean
}

export class Nav extends Component<any, NavState> {

    constructor(props: any) {
        super(props);

        this.state = {
            expanded: false
        }
    }

    setExpanded = (value: boolean) => {
        this.setState({
            expanded: value
        });
    }

    render() {
        const navOnClick = (e: any) => {
            this.setExpanded(false);
        };

        return (
            <Navbar onToggle={(e) => {
                this.setExpanded(!this.state.expanded)
            }} bg="light" expanded={this.state.expanded} expand="lg">
                <Container>
                    <Navbar.Brand onClick={navOnClick} as={NavLink} to={"/"} exact className={"nav-link"}>
                        <FontAwesomeIcon icon={faHome}/>&nbsp;
                        {process.env.REACT_APP_NAME}
                    </Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <BootstrapNav className="me-auto">
                        </BootstrapNav>
                        <BootstrapNav>
                            {(!Session.isLoggedIn()) && (
                                <>
                                    <NavLink onClick={navOnClick} to={"/login"} className={"nav-link"}>
                                        <FontAwesomeIcon icon={faSignInAlt}/>&nbsp;
                                        Anmelden
                                    </NavLink>
                                    <NavLink onClick={navOnClick} to={"/register"} className={"nav-link"}>
                                        <FontAwesomeIcon icon={faUserPlus}/>&nbsp;
                                        Registrieren
                                    </NavLink>
                                </>
                            )}
                            {(Session.isLoggedIn()) && (
                                <NavDropdown id={"profile-dropdown"} title={<><FontAwesomeIcon
                                    icon={faUser}/> &nbsp;{Session.currentUser?.getUsername()}</>}>
                                    <Dropdown.Item as={NavLink} onClick={navOnClick} to={"/my-profile"} role={"button"}>
                                        <FontAwesomeIcon icon={faUser}/>&nbsp;
                                        Mein Profil
                                    </Dropdown.Item>

                                    <Dropdown.Item as={"div"} className="p-0">
                                        <NavLink onClick={navOnClick} to={"/logout"} role={"button"}
                                                 className={"dropdown-item"}>
                                            <FontAwesomeIcon icon={faSignOutAlt}/>&nbsp;
                                            Abmelden
                                        </NavLink>
                                    </ Dropdown.Item>

                                </NavDropdown>
                            )}
                        </BootstrapNav>
                        {(!isDesktop()) && (
                            <BootstrapNav>
                                <NavDropdown id={"profile-dropdown"} title={"mehr"}>
                                    <Dropdown.Item as={NavLink} onClick={navOnClick} to={"/settings"} role={"button"}>
                                        <FontAwesomeIcon icon={faCog}/>&nbsp;
                                        Einstellungen
                                    </Dropdown.Item>
                                    <Dropdown.Item as={NavLink} onClick={navOnClick} to={"/data-privacy"}
                                                   role={"button"}>
                                        <FontAwesomeIcon icon={faShieldAlt}/>&nbsp;
                                        Datenschutz
                                    </Dropdown.Item>
                                    <Dropdown.Item as={NavLink} onClick={navOnClick} to={"/legal-notice"}
                                                   role={"button"}>
                                        <FontAwesomeIcon icon={faBalanceScale}/>&nbsp;
                                        Impressum
                                    </Dropdown.Item>
                                    <Dropdown.Item as={NavLink} onClick={navOnClick} to={"/about-us"} role={"button"}>
                                        <FontAwesomeIcon icon={faInfoCircle}/>&nbsp;
                                        Über uns
                                    </Dropdown.Item>
                                </NavDropdown>
                            </BootstrapNav>
                        )}
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }

}
