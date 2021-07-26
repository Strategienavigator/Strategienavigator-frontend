import React from "react";
import {Card, Col, Form, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {faCheck} from "@fortawesome/free-solid-svg-icons/faCheck";

const checkPassword = (password: string): PasswordFieldState => {
    console.log(password);
    let regexValidChars = "[A-Za-zäöüßÄÖÜ\\d$&§+,:;=?@#|'<>.^*()%!_-]";
    let obj: PasswordFieldState = {
        lowercase: false,
        uppercase: false,
        special: false,
        digits: false,
        maxLength: true,
        minLength: false,
        invalidChar: false
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

    return obj;
};

interface PasswordFieldProps {
    check: boolean
}

interface PasswordFieldState {
    lowercase: boolean
    uppercase: boolean
    special: boolean
    digits: boolean
    maxLength: boolean
    minLength: boolean
    invalidChar: boolean
}

class PasswordField extends React.Component<PasswordFieldProps, PasswordFieldState> {

    constructor(props: PasswordFieldProps | Readonly<PasswordFieldProps>) {
        super(props);

        this.state = {
            lowercase: false,
            uppercase: false,
            special: false,
            digits: false,
            maxLength: true,
            minLength: false,
            invalidChar: false
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

    render() {
        return (
            <>
                <Form.Group className={"mb-3 form-floating"}>
                    <Form.Control
                        id="password"
                        type="password"
                        name={"password"}
                        size={"sm"}
                        placeholder="Password"
                        onChange={(e) => {
                            this.changed(e)
                        }}
                    />
                    <Form.Label htmlFor={"password"} className={"loginLabel"}>Password</Form.Label>
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
                            {(this.state.maxLength && this.state.minLength && this.state.digits && this.state.uppercase && this.state.lowercase && this.state.special && !this.state.invalidChar) && (
                                <Row className={"text-success"}>
                                    <Col xs={2}><FontAwesomeIcon className={"text-success"} icon={faCheck}/></Col>
                                    <Col xs={10}>Ihr Passwort ist gültig !</Col>
                                </Row>
                            )}
                        </Card>
                    )}
                </Form.Group>
            </>
        );
    }

}

export {
    checkPassword,
    PasswordField
}
