import React from "react";
import {Card, Col, Form, Row} from "react-bootstrap";
import {faTimes} from "@fortawesome/free-solid-svg-icons/faTimes";
import {faCheck} from "@fortawesome/free-solid-svg-icons/faCheck";
import {faEye} from "@fortawesome/free-solid-svg-icons/faEye";
import {faEyeSlash} from "@fortawesome/free-solid-svg-icons/faEyeSlash";

import "./password-field.scss";
import FAE from "../Icons/FAE";


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

export interface PasswordFieldProps {
    check: boolean
    eye?: boolean
    text?: string
    required?: boolean
    id?: string
    // changeHandler?: React.ChangeEventHandler<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
    confirm?: boolean
}

export interface PasswordFieldState {
    lowercase: boolean
    uppercase: boolean
    special: boolean
    digits: boolean
    maxLength: boolean
    minLength: boolean
    invalidChar: boolean
    valid: boolean
    viewPassword?: boolean
    fieldTouched?: boolean
    confirmFieldTouched?: boolean
    passwordMatching?: boolean
}

class PasswordField<P> extends React.Component<P & PasswordFieldProps, PasswordFieldState> {
    private valid: boolean = false;
    private matching: boolean = false;

    private password: string | null = null;
    private passwordConfirm: string | null = null;

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
            valid: false,
            fieldTouched: false,
            passwordMatching: undefined
        }
    }

    isMatching = (): boolean => {
        return this.matching;
    }

    checkMatching = () => {
        if (this.password !== null && this.passwordConfirm !== null) {
            if (this.password === this.passwordConfirm) {
                this.matching = true;
                this.setState({
                    passwordMatching: true
                });
            } else {
                this.setState({
                    passwordMatching: false
                });
            }
        }
    }

    isValid = (): boolean => {
        return this.valid;
    }

    passwordConfirmChanged = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        this.passwordConfirm = e.currentTarget.value;
        if (this.passwordConfirm.length > 0) {
            this.setState({confirmFieldTouched: true});
        } else {
            this.setState({confirmFieldTouched: false});
        }
        this.checkMatching()
    }

    changed = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        /*if (this.props.changeHandler !== undefined) {
            this.props.changeHandler(e);
        }*/

        if (this.props.confirm) {
            this.password = e.currentTarget.value;
            this.checkMatching();
        }

        if (this.props.check) {
            let password: string = e.currentTarget.value;
            let checkedPassword = checkPassword(password);
            this.valid = checkedPassword.valid;

            if (password.length > 0) {
                this.setState({fieldTouched: true});
            } else {
                this.setState({fieldTouched: false});
            }

            this.setState(checkedPassword);
        }
    }


    switchPasswordView = () => {
        this.setState({
            viewPassword: !this.state.viewPassword
        });
    }

    render() {
        return (
            <div className={"mb-2"}>
                <Form.Floating>
                    <Form.Control
                        id={(this.props.id !== undefined) ? this.props.id : "password"}
                        type={(this.state.viewPassword) ? "text" : "password"}
                        name={(this.props.id !== undefined) ? this.props.id : "password"}
                        size={"sm"}
                        placeholder={"*********"}
                        required={(this.props.required !== undefined) ? this.props.required : false}
                        onChange={(e) => {
                            this.changed(e)
                        }}
                    />
                    <Form.Label
                        htmlFor={"password"}>{(this.props.text !== undefined) ? this.props.text : "Passwort"}</Form.Label>
                    {(this.props.eye) && (
                        <div title={(!this.state.viewPassword) ? "Passwort anzeigen" : "Passwort verstecken"}
                             onClick={this.switchPasswordView} className={"passwordEye"}>
                            <FAE icon={(!this.state.viewPassword) ? faEye : faEyeSlash}/>
                        </div>
                    )}
                </Form.Floating>
                {(this.props.check && this.state.fieldTouched) && (
                    <Card body>
                        {(!this.state.special) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FAE className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Min. ein Sonderzeichen {"$&§+,:;=?@#|'<>.^*()%!_-"}</Col>
                            </Row>
                        )}
                        {(!this.state.lowercase) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FAE className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Min. ein Kleinbuchstaben</Col>
                            </Row>
                        )}
                        {(!this.state.uppercase) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FAE className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Min. ein Großbuchstaben</Col>
                            </Row>
                        )}
                        {(!this.state.digits) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FAE className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Min. eine Zahl</Col>
                            </Row>
                        )}
                        {(!this.state.minLength) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FAE className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Ihr Passwort muss mindestens acht Zeichen haben !</Col>
                            </Row>
                        )}
                        {(!this.state.maxLength) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FAE className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Ihr Passwort darf maximal 120 Zeichen beinhalten !</Col>
                            </Row>
                        )}
                        {(this.state.invalidChar) && (
                            <Row className={"text-danger"}>
                                <Col xs={2}><FAE className={"text-danger"} icon={faTimes}/></Col>
                                <Col xs={10}>Invalides Zeichen!</Col>
                            </Row>
                        )}
                        {(this.state.valid) && (
                            <Row className={"text-success"}>
                                <Col xs={2}><FAE className={"text-success"} icon={faCheck}/></Col>
                                <Col xs={10}>Ihr Passwort ist gültig !</Col>
                            </Row>
                        )}
                    </Card>
                )}
                {(this.props.confirm) && (
                    <>
                        <Form.Floating className={"mt-2"}>
                            <Form.Control
                                id={"passwordConfirm"}
                                type={(this.state.viewPassword) ? "text" : "password"}
                                name={"passwordConfirm"}
                                size={"sm"}
                                placeholder={"*********"}
                                required={(this.props.required !== undefined) ? this.props.required : false}
                                onChange={(e) => {
                                    this.passwordConfirmChanged(e)
                                }}
                            />
                            <Form.Label htmlFor={"passwordConfirm"}>Passwort wiederholen</Form.Label>
                        </Form.Floating>
                        <div className={"feedback"}>
                            {(!this.state.passwordMatching && this.state.confirmFieldTouched) && (
                                <div className="invalid-feedback d-block">
                                    Passwörter müssen übereinstimmen!
                                </div>
                            )}
                        </div>
                    </>
                )}
            </div>

        );
    }

}

export {
    checkPassword,
    PasswordField
}
