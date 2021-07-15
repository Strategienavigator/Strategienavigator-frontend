import {Component} from "react";
import {Container, Form, FormControl, Nav as BootstrapNav, Navbar, NavDropdown} from "react-bootstrap";
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
                            <BootstrapNav.Link>
                                <FontAwesomeIcon icon={faHome}/>&nbsp;
                                Startseite
                            </BootstrapNav.Link>
                            <BootstrapNav.Link>
                                <FontAwesomeIcon icon={faCog}/>&nbsp;
                                Einstellungen
                            </BootstrapNav.Link>
                            <BootstrapNav.Link>
                                <FontAwesomeIcon icon={faShieldAlt}/>&nbsp;
                                Datenschutz
                            </BootstrapNav.Link>
                            <BootstrapNav.Link>
                                <FontAwesomeIcon icon={faBalanceScale}/>&nbsp;
                                Impressum
                            </BootstrapNav.Link>
                            <BootstrapNav.Link>
                                <FontAwesomeIcon icon={faSignInAlt}/>&nbsp;
                                Anmelden
                            </BootstrapNav.Link>
                            <BootstrapNav.Link>
                                <FontAwesomeIcon icon={faUserPlus}/>&nbsp;
                                Registrieren
                            </BootstrapNav.Link>
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
                                <NavDropdown.Item>Mein Profil</NavDropdown.Item>
                                <NavDropdown.Item>Abmelden</NavDropdown.Item>
                            </NavDropdown>
                        </BootstrapNav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }

}

export default Nav;