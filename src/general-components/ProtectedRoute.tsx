import {Redirect, RouteProps, useHistory} from "react-router";
import {Link, Route} from "react-router-dom";
import {Session} from "./Session/Session";
import {Button, Modal} from "react-bootstrap";
import {useState} from "react";
import {reload_app} from "../index";
import {Loader} from "./Loader/Loader";
import {faCheckCircle, faExclamationTriangle, faTimesCircle} from "@fortawesome/free-solid-svg-icons";
import FAE from "./Icons/FAE";


interface ProtectedRouteProps extends RouteProps {
    loggedIn?: boolean | undefined
    anonymous?: boolean | undefined
    loginAnonymous?: boolean | undefined
}

export function AnonymousModal(props: {
    onAgreement: () => Promise<void>,
    onDisagreement: () => Promise<void>,
    onShowChange?: (show: boolean) => void
}) {
    let [showModal, setShowModal] = useState(true);
    let [agreementLoading, setAgreementLoading] = useState(false);
    let [disagreementLoading, setDisagreementLoading] = useState(false);

    return (
        <Modal
            show={showModal}
            backdrop="static"
            centered
            keyboard={true}
        >
            <Modal.Header>
                <b><FAE icon={faExclamationTriangle}/> Achtung!</b>
            </Modal.Header>
            <Modal.Body>
                <b>Wollen Sie sich als anonymer Nutzer anmelden?</b><br/>
                <br/>
                Als anonymer Nutzer können Sie nur auf Ihrem aktuellen Gerät und nur in
                Ihrem aktuellen Browser auf erstellte Analysen zugreifen.<br/><br/>

                <b>Die Daten von anonymen Nutzern werden nach 30 Tagen gelöscht.</b><br/><br/>

                Außerdem können Sie nicht die vollen Funktionalitäten der Anwendung nutzen. Sollten Sie daher bereits
                einen Account besitzen, <Link onClick={() => {
                setShowModal(false);

                if (props.onShowChange) {
                    props.onShowChange(false);
                }
            }} to={"/login"}>loggen Sie sich bitte mit diesem ein</Link>, oder <Link onClick={() => {
                setShowModal(false);

                if (props.onShowChange) {
                    props.onShowChange(false);
                }
            }} to={"/register"}>Registrieren Sie sich</Link>.
            </Modal.Body>
            <Modal.Footer>
                <Button disabled={agreementLoading} onClick={async () => {
                    setAgreementLoading(true);
                    await props.onAgreement();
                    setShowModal(false);
                    setAgreementLoading(false);

                    if (props.onShowChange) {
                        props.onShowChange(false);
                    }
                }}>
                    <Loader payload={[]} variant={"dark"} transparent size={15} text={<span>&nbsp;Annehmen</span>}
                            loaded={!agreementLoading}>
                        <FAE icon={faCheckCircle}/> Annehmen
                    </Loader>
                </Button>

                <Button disabled={disagreementLoading} onClick={async () => {
                    setDisagreementLoading(true);
                    await props.onDisagreement();
                    setShowModal(false);
                    setDisagreementLoading(false);

                    if (props.onShowChange) {
                        props.onShowChange(false);
                    }
                }}>
                    <Loader payload={[]} variant={"dark"} transparent size={15} text={<span>&nbsp;Ablehnen</span>}
                            loaded={!disagreementLoading}>
                        <FAE icon={faTimesCircle}/> Ablehnen
                    </Loader>
                </Button>
            </Modal.Footer>
        </Modal>
    );
}

function ProtectedRoute(props: ProtectedRouteProps) {
    let history = useHistory();

    if (props.loggedIn !== undefined) {
        if (props.loggedIn === Session.isLoggedIn()) {
            if (props.anonymous !== undefined) {
                if (props.anonymous !== Session.isAnonymous()) {
                    return (
                        <Redirect to={"/"}/>
                    );
                }
            }
        } else if (props.loggedIn) {
            if (props.loginAnonymous !== undefined && props.loginAnonymous) {
                const loginAnonymous = async () => {
                    let anonUser = await Session.loginAnonymous();
                    if (anonUser) {
                        let user = await Session.login(anonUser.username, anonUser.password, true);
                        if (user) {
                            reload_app();
                        }
                    }
                }
                const redirectUser = async () => {
                    history.push("/");
                }

                return (
                    <AnonymousModal onDisagreement={redirectUser} onAgreement={loginAnonymous}/>
                );
            }

            return (
                <Redirect to={"/login"}/>
            );
        } else {
            return (
                <Redirect to={"/"}/>
            );
        }
    }

    return (
        <Route {...props} />
    );
}

export {
    ProtectedRoute
}
