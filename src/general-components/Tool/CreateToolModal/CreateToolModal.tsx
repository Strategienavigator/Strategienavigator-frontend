import './create-tool-modal.scss'
import React, {Component, FormEvent} from "react";
import {Button, Form, Modal} from "react-bootstrap";
import {Loader} from "../../Loader/Loader";
import {extractFromForm} from "../../FormHelper";

interface CreateToolModalState {
    nameError?: {
        empty?: boolean
    }
    descriptionError?: {
        empty?: boolean
    }
}

interface CreateToolModalProps {
    onSaveCreated: (name: string, description: string) => void
    onCancel: () => void
    isCreatingNewSave:boolean
}

export class CreateToolModal extends Component<CreateToolModalProps, CreateToolModalState> {


    constructor(props: Readonly<CreateToolModalProps> | (CreateToolModalProps));
    constructor(props: CreateToolModalProps, context: any);
    constructor(props: (CreateToolModalProps) | Readonly<CreateToolModalProps>, context?: any) {
        super(props, context);
        this.state = {}
    }

    render() {
        return this.getNewToolModal();
    }

    private getNewToolModal = () => {
        return (
            <Modal
                show={true}
                backdrop="static"
                centered
                keyboard={true}
            >
                <Modal.Header>
                    <Modal.Title>Bezeichnung und Beschreibung</Modal.Title>
                </Modal.Header>
                <Modal.Body>
                    Für Ihre neue Analyse müssen Sie nur noch eine Bezeichnung und Beschreibung angeben.

                    <br/>

                    <Form className={"mt-3"} onSubmit={async (e) => {
                        await this.OnNewToolModalSubmit(e)
                    }} id={"toolhomeInput"}>
                        <Form.Floating className={"mb-2"}>
                            <Form.Control
                                id="name"
                                type="text"
                                name={"name"}
                                size={"sm"}
                                placeholder="Bezeichnung"
                            />
                            <Form.Label htmlFor={"name"}>Bezeichnung</Form.Label>
                        </Form.Floating>

                        {(this.state.nameError) && (
                            <div className={"feedbackContainer mb-2"}>
                                {this.state.nameError.empty && (
                                    <div className={"feedback DANGER"}>
                                        Bitte geben Sie eine Bezeichnung an.
                                    </div>
                                )}
                            </div>
                        )}

                        <Form.Floating className={"mb-2"}>
                            <Form.Control
                                as="textarea"
                                style={{height: 100}}
                                id="description"
                                name={"description"}
                                rows={10}
                                size={"sm"}
                                placeholder="Beschreibung"
                            />
                            <Form.Label htmlFor={"description"}>Beschreibung</Form.Label>
                        </Form.Floating>

                        {(this.state.descriptionError) && (
                            <div className={"feedbackContainer mb-2"}>
                                {this.state.descriptionError.empty && (
                                    <div className={"feedback DANGER"}>
                                        Bitte geben Sie eine Beschreibung an.
                                    </div>
                                )}
                            </div>
                        )}
                    </Form>
                </Modal.Body>
                <Modal.Footer>
                    <Button onClick={this.props.onCancel} variant={"light"} type={"button"}>
                        Zurück
                    </Button>
                    <Button variant={"dark"} disabled={this.props.isCreatingNewSave} type={"submit"}
                            form={"toolhomeInput"}>
                        <Loader payload={[]} loaded={!this.props.isCreatingNewSave} transparent variant={"dark"}
                                size={15} text={<span>&nbsp;Jetzt beginnen</span>}>
                            Jetzt beginnen
                        </Loader>
                    </Button>
                </Modal.Footer>
            </Modal>
        );
    }

    private OnNewToolModalSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        this.setState({
            nameError: undefined,
            descriptionError: undefined
        });

        let error = false;
        let name: string = extractFromForm(e, "name") as string;
        let desc: string = extractFromForm(e, "description") as string;

        if (name === "" || name === null || name === undefined) {
            error = true;
            this.setState({
                nameError: {
                    empty: true
                }
            });
        }
        if (desc === "" || desc === null || desc === undefined) {
            error = true;
            this.setState({
                descriptionError: {
                    empty: true
                }
            });
        }

        if (!error) {

            this.props.onSaveCreated(name, desc);
        }
    }
}
