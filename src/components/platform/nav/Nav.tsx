import {Component} from "react";
import {Container, Dropdown, Form, FormControl, Nav as BootstrapNav, Navbar, NavDropdown} from "react-bootstrap";
import {NavLink} from "react-router-dom";
import {faHome} from "@fortawesome/free-solid-svg-icons/faHome";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCog} from "@fortawesome/free-solid-svg-icons/faCog";
import {faShieldAlt} from "@fortawesome/free-solid-svg-icons/faShieldAlt";
import {faBalanceScale} from "@fortawesome/free-solid-svg-icons/faBalanceScale";
import {faUser} from "@fortawesome/free-solid-svg-icons/faUser";
import {faSignInAlt} from "@fortawesome/free-solid-svg-icons/faSignInAlt";
import {faUserPlus} from "@fortawesome/free-solid-svg-icons/faUserPlus";
import {Session} from "../../../general-components/Session/Session";

interface NavState {
    expanded: boolean
}

class Nav extends Component<any, NavState> {

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
                    <Navbar.Brand>{process.env.REACT_APP_NAME}</Navbar.Brand>
                    <Navbar.Toggle/>
                    <Navbar.Collapse>
                        <BootstrapNav className="me-auto">
                            <NavLink onClick={navOnClick} exact to={"/"} className={"nav-link"}>
                                <FontAwesomeIcon icon={faHome}/>&nbsp;
                                Startseite
                            </NavLink>
                            <NavLink onClick={navOnClick} to={"/settings"} className={"nav-link"}>
                                <FontAwesomeIcon icon={faCog}/>&nbsp;
                                Einstellungen
                            </NavLink>
                            <NavLink onClick={navOnClick} to={"/data-privacy"} className={"nav-link"}>
                                <FontAwesomeIcon icon={faShieldAlt}/>&nbsp;
                                Datenschutz
                            </NavLink>
                            <NavLink onClick={navOnClick} to={"/legal-notice"} className={"nav-link"}>
                                <FontAwesomeIcon icon={faBalanceScale}/>&nbsp;
                                Impressum
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
                                <NavDropdown id={"profile-dropdown"} title={<FontAwesomeIcon icon={faUser}/>}>
                                    <Dropdown.Item as={NavLink} onClick={navOnClick} to={"/my-profile"} role={"button"}>
                                        Mein Profil
                                    </Dropdown.Item>

                                    <Dropdown.Item as={"div"} className="p-0">
                                        <NavLink onClick={navOnClick} to={"/logout"} role={"button"}
                                                 className={"dropdown-item"}>
                                            Abmelden
                                        </NavLink>
                                    </ Dropdown.Item>

                                </NavDropdown>
                            )}
                        </BootstrapNav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        );
    }

}

export default Nav;