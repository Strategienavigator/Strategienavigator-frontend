import React from "react";
import {Card, Col, Form, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {faCheck} from "@fortawesome/free-solid-svg-icons/faCheck";
import {faEye} from "@fortawesome/free-solid-svg-icons/faEye";

import "./password-field.scss";
import {faEyeSlash} from "@fortawesome/free-solid-svg-icons/faEyeSlash";

const checkPassword = (password: string): PasswordFieldState => {
    let regexValidChars = "[A-Za-zäöüßÄÖÜ\\d$&§+,:;=?@#|'<>.^*()%!_-]";
    let obj: PasswordFieldState = {
        lowercase: false,
        uppercase: false,
        special: false,
        digits: false,
        maxLength: true,
        minLength: false,
        invalidChar: false,
        valid: false
    }

    // lowercase
    let regex = /[a-zäöüß]/.test(password);
    if (regex) {
        obj.lowercase = true;
    }

    // uppercase
    regex = /[A-ZÄÖÜ]/.test(password);
    if (regex) {
        obj.uppercase = true;
    }

    // special
    regex = /[$&§+,:;=?@#|'<>.^*()%!_-]/.test(password);
    if (regex) {
        obj.special = true;
    }

    // digits
    regex = /[0-9]/.test(password);
    if (regex) {
        obj.digits = true;
    }

    // minlength
    regex = RegExp(regexValidChars + "{8,}", "g").test(password);
    if (regex) {
        obj.minLength = true;
    }

    // maxlength
    if (password.length > 120) {
        obj.maxLength = false;
    }

    regex = RegExp("^" + regexValidChars + "{0,}$", "g").test(password);
    if (!regex) {
        obj.invalidChar = true;
    }

    if (obj.maxLength && obj.minLength && obj.digits && obj.uppercase && obj.lowercase && obj.special && !obj.invalidChar) {
        obj.valid = true;
    }

    return obj;
};

interface PasswordFieldProps {
    check: boolean
    eye?: boolean
}

interface PasswordFieldState {
    lowercase: boolean
    uppercase: boolean
    special: boolean
    digits: boolean
    maxLength: boolean
    minLength: boolean
    invalidChar: boolean
    valid: boolean
    viewPassword?: boolean
}

class PasswordField<P> extends React.Component<P & PasswordFieldProps, PasswordFieldState> {

    constructor(props: (P & PasswordFieldProps) | Readonly<P & PasswordFieldProps>) {
        super(props);

        this.state = {
            viewPassword: false,
            lowercase: false,
            uppercase: false,
            special: false,
            digits: false,
            maxLength: true,
            minLength: false,
            invalidChar: false,
            valid: false
        }
    }

    changed = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        if (this.props.check) {
            let password: string = e.currentTarget.value;
            let checkedPassword = checkPassword(password);

            if (checkedPassword !== null) {
                this.setState(checkedPassword);
            }
        }
    }

    switchPasswordView = () => {
        this.setState({
            viewPassword: !this.state.viewPassword
        });
    }

    render() {
        return (
            <>
                <Form.Group className={((!this.props.check) ? "mb-3 " : "") + "form-floating"}>
                    <Form.Control
                        id="password"
                        type={(this.state.viewPassword) ? "text" : "password"}
                        name={"password"}
                        size={"sm"}
                        placeholder="Password"
                        onChange={(e) => {
                            this.changed(e)
                        }}
                    />
                    <Form.Label htmlFor={"password"}>Password</Form.Label>
                    {(this.props.eye) && (
                        <div title={(!this.state.viewPassword) ? "Passwort anzeigen" : "Passwort verstecken"}
                             onClick={this.switchPasswordView} className={"passwordEye"}>
                            <FontAwesomeIcon icon={(!this.state.viewPassword) ? faEye : faEyeSlash}/>
                        </div>
                    )}
                </Form.Group>
                {(this.props.check) && (
                    <Card body>
                        {(!this.state.special) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FontAwesomeIcon className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Min. ein Sonderzeichen {"$&§+,:;=?@#|'<>.^*()%!_-"}</Col>
                            </Row>
                        )}
                        {(!this.state.lowercase) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FontAwesomeIcon className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Min. ein Kleinbuchstaben</Col>
                            </Row>
                        )}
                        {(!this.state.uppercase) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FontAwesomeIcon className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Min. ein Großbuchstaben</Col>
                            </Row>
                        )}
                        {(!this.state.digits) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FontAwesomeIcon className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Min. eine Zahl</Col>
                            </Row>
                        )}
                        {(!this.state.minLength) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FontAwesomeIcon className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Ihr Passwort muss mindestens acht Zeichen haben !</Col>
                            </Row>
                        )}
                        {(!this.state.maxLength) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FontAwesomeIcon className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Ihr Passwort darf maximal 120 Zeichen beinhalten !</Col>
                            </Row>
                        )}
                        {(this.state.invalidChar) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FontAwesomeIcon className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Invalides Zeichen!</Col>
                            </Row>
                        )}
                        {(this.state.valid) && (
                            <Row className={"text-success"}>
                                <Col xs={2}><FontAwesomeIcon className={"text-success"} icon={faCheck}/></Col>
                                <Col xs={10}>Ihr Passwort ist gültig !</Col>
                            </Row>
                        )}
                    </Card>
                )}
            </>
        );
    }

}

export {
    checkPassword,
    PasswordField
}
