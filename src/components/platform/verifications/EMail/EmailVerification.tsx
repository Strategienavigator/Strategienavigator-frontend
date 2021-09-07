import React, {Component} from "react";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCheck} from "@fortawesome/free-solid-svg-icons";
import {RouteComponentProps} from "react-router";
import {verifyEmail} from "../../../../general-components/API/calls/Email";
import {faTimes} from "@fortawesome/free-solid-svg-icons/";
import {Loader} from "../../../../general-components/Loader/Loader";
import {Button} from "react-bootstrap";
import {Link} from "react-router-dom";

import "./email-verification.scss";


export interface EmailVerificationState {
    loaded: boolean
    success?: boolean
}

export interface RouteMatches {
    token: string
}

export class EmailVerification extends Component<RouteComponentProps<RouteMatches>, EmailVerificationState> {
    private readonly token: string;

    constructor(props: Readonly<RouteComponentProps<RouteMatches>> | RouteComponentProps<RouteMatches>) {
        super(props);

        this.token = this.props.match.params.token;

        this.state = {
            loaded: false
        };
    }

    componentDidMount = async () => {
        let call = await verifyEmail(this.token);

        this.setState({
            loaded: true,
            success: call.success
        });
    }

    render() {
        return (
            <div className="emailVerification">
                {(!this.state.loaded) ? (
                    <>
                        <Loader payload={[]} loaded={false} size={100} animate={false} transparent/>
                    </>
                ) : (
                    (this.state.success) ? (
                        <>
                            <FontAwesomeIcon icon={faCheck}/>
                            <h4>Ihre E-Mail wurde erfolgreich verifiziert!</h4>

                            <Link to={"/login"}>
                                <Button variant="dark">
                                    Jetzt Anmelden
                                </Button>
                            </Link>
                        </>
                    ) : (
                        <>
                            <FontAwesomeIcon icon={faTimes}/>
                            <h4>Die Verifikation Ihrer E-Mail Adresse ist fehlgeschlagen!</h4>
                        </>
                    )
                )}

            </div>
        );
    }

}
