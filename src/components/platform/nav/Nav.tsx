import {Component} from "react";
import {Container, Form, FormControl, Nav as BootstrapNav, Navbar, NavDropdown} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {faHome} from "@fortawesome/free-solid-svg-icons/faHome";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog} from "@fortawesome/free-solid-svg-icons/faCog";
import {faShieldAlt} from "@fortawesome/free-solid-svg-icons/faShieldAlt";
import {faBalanceScale} from "@fortawesome/free-solid-svg-icons/faBalanceScale";
import {faUser} from "@fortawesome/free-solid-svg-icons/faUser";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons/faSignInAlt";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons/faUserPlus";

class Nav extends Component<any, any> {

    render() {
        return (
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Toggle/>
                    <Navbar.Brand>{process.env.REACT_APP_NAME}</Navbar.Brand>
                    <Navbar.Collapse>
                        <BootstrapNav className="me-auto">
                            <NavLink exact to={"/"} className={"nav-link"} >
                                <FontAwesomeIcon icon={faHome}/>&nbsp;
                                Startseite
                            </NavLink>
                            <NavLink to={"/settings"} className={"nav-link"} >
                                <FontAwesomeIcon icon={faCog}/>&nbsp;
                                Einstellungen
                            </NavLink>
                            <NavLink to={"/data-privacy"} className={"nav-link"} >
                                <FontAwesomeIcon icon={faShieldAlt}/>&nbsp;
                                Datenschutz
                            </NavLink>
                            <NavLink to={"/imprint"} className={"nav-link"} >
                                <FontAwesomeIcon icon={faBalanceScale}/>&nbsp;
                                Impressum
                            </NavLink>
                            <NavLink to={"/login"} className={"nav-link"} >
                                <FontAwesomeIcon icon={faSignInAlt}/>&nbsp;
                                Anmelden
                            </NavLink>
                            <NavLink to={"/register"} className={"nav-link"} >
                                <FontAwesomeIcon icon={faUserPlus}/>&nbsp;
                                Registrieren
                            </NavLink>
                        </BootstrapNav>
                        <BootstrapNav>
                            <Form className="d-flex justify-content-center align-items-center">
                                <FormControl
                                    size={"sm"}
                                    style={{maxHeight: '50px'}}
                                    type="search"
                                    placeholder="Search"
                                    className="mr-2"
                                    aria-label="Search"
                                />
                            </Form>
                            <NavDropdown id={"profile-dropdown"} title={<FontAwesomeIcon icon={faUser}/>}>
                                <NavLink to={"/my-profile"} role={"button"} className={"dropdown-item"} >
                                    Mein Profil
                                </NavLink>
                                <NavLink to={"/logout"} role={"button"} className={"dropdown-item"} >
                                    Abmelden
                                </NavLink>
                            </NavDropdown>
                        </BootstrapNav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }

}

export default Nav;