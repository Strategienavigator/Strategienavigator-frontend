import React, {Component} from "react";

import './desktop-buttons.scss';
import {Button} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faCaretRight, faUndo} from "@fortawesome/free-solid-svg-icons";
import {LoadingButton} from "../../../../LoadingButton/LoadingButton";
import {CustomNextButton} from "../StepComponent";
import {ExportButton} from "../../../ExportButton";
import {Tool} from "../../../Tool";

export interface DesktopButtonsState {

}

export interface DesktopButtonsProps {
    tool: Tool
    hasCustomNextButton:boolean,
    formID:string,
    nextDisabled:boolean,
    customNextButton:CustomNextButton
    isSaving:boolean,
    onSave:()=>void,
    onReset:()=>void
    onExportClick: () => void
}

export class DesktopButtons extends Component<DesktopButtonsProps, DesktopButtonsState> {

    render() {
        return (
            <>
                {(!this.props.hasCustomNextButton) ? (
                    <Button
                        variant={"dark"}
                        type={"submit"}
                        form={this.props.formID}
                        disabled={this.props.nextDisabled}
                        className={"mt-2 mx-2"}
                        key={"nextButton"}
                    >
                        <FontAwesomeIcon icon={faCaretRight}/> Weiter
                    </Button>
                ) : (
                    <Button
                        variant={"dark"}
                        type={"button"}
                        onClick={this.props.customNextButton?.callback}
                        disabled={this.props.nextDisabled}
                        className={"mt-2 mx-2"}
                        key={"customNextButton"}
                    >
                        <FontAwesomeIcon
                            icon={faCaretRight}/> {this.props.customNextButton?.text}
                    </Button>
                )}
                <Button
                    variant={"dark"}
                    type={"button"}
                    className={"mt-2"}
                    onClick={this.props.onReset}
                    key={"resetButton"}
                >
                    <FontAwesomeIcon
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
                    tool={this.props.tool}
                    onClick={() => {
                        this.props.onExportClick();
                    }}
                />
            </>
        );
    }
}
