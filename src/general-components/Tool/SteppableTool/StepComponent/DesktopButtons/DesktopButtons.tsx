import React, {PureComponent} from "react";

import './desktop-buttons.scss';
import {Button} from "react-bootstrap";
import {faCaretRight, faUndo} from "@fortawesome/free-solid-svg-icons";
import {LoadingButton} from "../../../../LoadingButton/LoadingButton";
import {CustomNextButton} from "../StepComponent";
import {ExportButton} from "../../../ExportButton";
import {Tool} from "../../../Tool";
import FAE from "../../../../Icons/FAE";

export interface DesktopButtonsState {

}

export interface DesktopButtonsProps {
    tool: Tool<any>
    nextDisabled: boolean,
    isSaving: boolean,
    onNext: () => void,
    onSave: () => void,
    onReset: () => void
    onExportClick: () => void
    customNextButton?: CustomNextButton
}

export class DesktopButtons extends PureComponent<DesktopButtonsProps, DesktopButtonsState> {

    render() {
        return (
            <>

                <Button
                    variant={"dark"}
                    type={"button"}
                    onClick={this.props.onNext}
                    disabled={this.props.nextDisabled}
                    className={"mt-2 mx-2"}
                    key={"customNextButton"}
                >
                    <FAE icon={faCaretRight}/> {this.props.customNextButton?.text ?? "Weiter"}
                </Button>

                <Button
                    variant={"dark"}
                    type={"button"}
                    className={"mt-2"}
                    onClick={this.props.onReset}
                    key={"resetButton"}
                >
                    <FAE
                        icon={faUndo}/> Zurücksetzen
                </Button>

                <br/>

                <LoadingButton
                    variant={"dark"}
                    type={"button"}
                    onClick={this.props.onSave}
                    className={"mt-2 mx-2"}
                    key={"saveButton"}
                    isSaving={this.props.isSaving}
                    savingChild={"Speichern"}
                    defaultChild={"Speichern"}
                />

                <ExportButton
                    onClick={this.props.onExportClick}
                />
            </>
        );
    }
}
