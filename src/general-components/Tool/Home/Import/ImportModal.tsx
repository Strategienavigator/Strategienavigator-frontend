import {ModalCloseable} from "../../../Modal/ModalCloseable";
import {Button, Form, FormControl, FormGroup, Modal} from "react-bootstrap";
import {faFileImport} from "@fortawesome/free-solid-svg-icons";
import React, {Component, FormEvent} from "react";
import {Tool} from "../../Tool";
import {extractFromForm} from "../../../FormHelper";
import {JSONImporterError} from "../../../Import/JSONImporter";
import {LoadingButton} from "../../../LoadingButton/LoadingButton";


export interface ImportModalProps {
    show: boolean,
    onClose: () => void
    tool: Tool<any>
}

interface ImportModalState {
    noFile: boolean
    loadingImport: boolean
    error: null | string
}

class ImportModal extends Component<ImportModalProps, ImportModalState> {
    state = {
        noFile: false,
        loadingImport: false,
        error: null
    }

    private onSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        this.setState({
            noFile: false,
            error: null,
            loadingImport: true
        });

        extractFromForm(e, "file", async (content) => {
            if (content != null) {
                let importer = this.props.tool.getImporter();
                if (importer == undefined) {
                    throw new Error("No importer set for analysis: " + this.props.tool.getToolName());
                }

                try {
                    await importer.onImport(content);
                } catch (e: unknown) {
                    if (e instanceof JSONImporterError) {
                        this.setState({
                            error: e.message
                        });
                    }
                }
            } else {
                this.setState({
                    noFile: true
                });
            }
            this.setState({
                loadingImport: false
            });
        });
    }

    public render() {
        return (
            <ModalCloseable
                show={this.props.show}
                backdrop
                centered
                onHide={this.props.onClose}
                keyboard={true}
            >
                <Form onSubmit={this.onSubmit}>
                    <Modal.Header>
                        <Modal.Title>Speicherstand importieren</Modal.Title>
                    </Modal.Header>
                    <Modal.Body>
                        <p>
                            Um einen Speicherstand zu importieren müssen Sie noch die Datei des Speicherstandes
                            auswählen.
                            <br/><br/>
                            <b>Wichtig:</b> Es muss sich hierbei um die Analyse "{this.props.tool.getToolName()}"
                            handeln.
                        </p>

                        <FormGroup>
                            <FormControl name={"file"} size={"sm"} accept={"application/JSON"} type={"file"}
                                         disabled={this.state.loadingImport}/>
                        </FormGroup>

                        {this.state.noFile && (
                            <div className={"feedbackContainer"}>
                                <div className={"feedback DANGER"}>Keine Datei ausgewählt!</div>
                            </div>
                        )}
                        {this.state.error != null && (
                            <div className={"feedbackContainer"}>
                                <div className={"feedback DANGER"}>{this.state.error}</div>
                            </div>
                        )}
                    </Modal.Body>
                    <Modal.Footer>
                        <Button onClick={this.props.onClose} variant={"danger"} disabled={this.state.loadingImport}>
                            Abbrechen
                        </Button>
                        <LoadingButton
                            type={"submit"}
                            isLoading={this.state.loadingImport}
                            disabled={this.state.loadingImport}
                            variant={"dark"}
                            defaultChild={"Importieren"}
                            savingChild={"Importiert..."}
                            defaultIcon={faFileImport}
                        />
                    </Modal.Footer>
                </Form>
            </ModalCloseable>
        );
    }

}

export {
    ImportModal
}