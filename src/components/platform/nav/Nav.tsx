import {ChangeEvent, Component} from "react";
import {Badge, Card, Container, Dropdown, FormControl, Nav as BootstrapNav, Navbar, NavDropdown} from "react-bootstrap";
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
import {getSaves} from "../../../general-components/API/calls/Saves";
import {PaginationResource, SaveResource} from "../../../general-components/Datastructures";
import {Loader} from "../../../general-components/Loader/Loader";
import {RouteComponentProps, withRouter} from "react-router";


interface NavState {
    expanded: boolean
    showSearchOutput: boolean
    searchResult: SaveResource[]
    searchLoading: boolean
}

class Nav extends Component<RouteComponentProps, NavState> {
    private timeout: NodeJS.Timeout | undefined;

    constructor(props: any) {
        super(props);

        this.state = {
            expanded: false,
            showSearchOutput: false,
            searchResult: [],
            searchLoading: false
        }
    }

    setExpanded = (value: boolean) => {
        this.setState({
            expanded: value
        });
    }

    search = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        let value = e.target.value;

        if (value === "") {
            this.setState({showSearchOutput: false});
        } else {
            this.setState({showSearchOutput: true});

            if (this.timeout) {
                clearTimeout(this.timeout);
            }

            this.timeout = setTimeout(async () => {
                this.setState({
                    searchLoading: true,
                    searchResult: []
                });

                let nameCall = await getSaves(Session.currentUser?.getID() as number, Session.getToken(), undefined, undefined, value, undefined);
                let nameCallData = nameCall.callData as PaginationResource<SaveResource>;

                let descriptionCall = await getSaves(Session.currentUser?.getID() as number, Session.getToken(), undefined, undefined, undefined, value);
                let descriptionCallData = descriptionCall.callData as PaginationResource<SaveResource>;

                let data = nameCallData.data.concat(descriptionCallData.data);
                let uniqueData = this.removeDuplicateSaves(data);

                this.setState({
                    searchLoading: false,
                    searchResult: uniqueData
                });
            }, 400);
        }
    }

    removeDuplicateSaves = (saves: SaveResource[]): SaveResource[] => {
        let newSaves = [];
        let ids = new Map<number, null>();

        for (const save of saves) {
            if (!ids.has(save.id)) {
                newSaves.push(save);
            }

            ids.set(save.id, null);
        }

        return newSaves;
    }

    getToolLink(toolID: number, saveID: number) {
        if (toolID === 1) {
            return "/utility-analysis/" + saveID;
        } else if (toolID === 2) {
            return "/swot-analysis/" + saveID;
        } else if (toolID === 3) {
            return "/paarwise-comparison/" + saveID;
        }
        return "/";
    }

    getToolName(toolID: number) {
        if (toolID === 1) {
            return "Nutzwertanalyse";
        } else if (toolID === 2) {
            return "SWOT Analyse";
        } else if (toolID === 3) {
            return "Paarweiser Vergleich";
        }
    }

    render() {
        const navOnClick = () => {
            this.setExpanded(false);
        };

        return (
            <Navbar onToggle={(e) => {
                this.setExpanded(!this.state.expanded)
            }} expanded={this.state.expanded} expand="lg">
                <Container>
                    <Navbar.Brand onClick={navOnClick} as={NavLink} to={"/"} exact className={"nav-link"}>
                        <FontAwesomeIcon icon={faHome}/>&nbsp;
                        {process.env.REACT_APP_NAME}
                    </Navbar.Brand>

                    <Navbar.Toggle/>

                    <Navbar.Collapse>
                        <BootstrapNav className="m-auto">
                            {(Session.isLoggedIn()) && (
                                <div className={"searchContainer"}>
                                    <FormControl
                                        type={"search"}
                                        title={"Nach Analysen suchen"}
                                        placeholder={"Nach Analysen suchen..."}
                                        onFocus={(e) => {
                                            if (e.target.value !== "") {
                                                this.setState({showSearchOutput: true});
                                            }
                                        }}
                                        onBlur={() => {
                                            this.setState({showSearchOutput: false});
                                        }}
                                        onChange={(e) => {
                                            this.search(e);
                                        }}
                                    />

                                    <div
                                        className={"searchOutputContainer " + (this.state.showSearchOutput ? "show" : "")}>
                                        <div className={"header"}>
                                            <Badge pill bg={"dark"}>
                                                <Loader payload={[]} variant={"dark"} loaded={!this.state.searchLoading}
                                                        transparent
                                                        size={10}>
                                                    {this.state.searchResult.length}
                                                </Loader>
                                            </Badge>&nbsp;
                                            Ergebnisse
                                        </div>
                                        <div className={"output"}>
                                            <Loader payload={[]} variant={"light"} loaded={!this.state.searchLoading}
                                                    transparent
                                                    size={100} alignment={"center"}>
                                                {this.state.searchResult.map((value) => {
                                                    let link = this.getToolLink(value.tool_id, value.id);
                                                    return (
                                                        <Card as={NavLink} title={(value.description !== null) ? "Beschreibung: " + value.description : ""}
                                                              to={link} onMouseDown={() => {
                                                            this.props.history.push(link);
                                                        }} key={"SAVE" + value.id} body className={"result"}>
                                                            {value.name} | {this.getToolName(value.tool_id)}
                                                        </Card>
                                                    )
                                                })}
                                                {this.state.searchResult.length === 0 && (
                                                    <Card body className={"result none"}>
                                                        Keine Ergebnisse
                                                    </Card>
                                                )}
                                            </Loader>
                                        </div>
                                    </div>
                                </div>
                            )}
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

export default withRouter(Nav);