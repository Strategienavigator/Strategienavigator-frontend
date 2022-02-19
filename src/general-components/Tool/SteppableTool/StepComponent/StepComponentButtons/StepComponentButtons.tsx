import React, {PureComponent} from "react";

import './step-component-buttons.scss';
import {Button} from "react-bootstrap";
import {faCaretRight, faFileExport, faSave, faUndo} from "@fortawesome/free-solid-svg-icons";
import {LoadingButton} from "../../../../LoadingButton/LoadingButton";
import {CustomNextButton} from "../StepComponent";
import {ExportButton} from "../../../ExportButton";
import FAE from "../../../../Icons/FAE";
import {ButtonItem, NextStepItem} from "../../../../ControlFooter/ControlFooter";
import {FooterContext} from "../../../../Contexts/FooterContextComponent";

export interface DesktopButtonsState {

}

export interface DesktopButtonsProps {
    nextDisabled: boolean,
    isSaving: boolean,
    /**
     * blendet die Buttons aus und setzt nur die bottom sheet buttons
     */
    isMobile: boolean,
    onNext: () => void,
    onSave: () => void,
    onReset: () => void
    onExportClick: () => void
    customNextButton?: CustomNextButton
}

export class StepComponentButtons extends PureComponent<DesktopButtonsProps, DesktopButtonsState> {

    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = FooterContext;
    context!: React.ContextType<typeof FooterContext>

    componentDidMount() {
        this.setFooterButtons();
    }


    componentWillUnmount() {
        this.context.clearItems();
    }

    componentDidUpdate(prevProps: Readonly<DesktopButtonsProps>, prevState: Readonly<DesktopButtonsState>, snapshot?: any) {

        if (
            prevProps.customNextButton !== this.props.customNextButton ||
            prevProps.isSaving !== this.props.isSaving ||
            prevProps.nextDisabled !== this.props.nextDisabled
        ) {
            this.setFooterButtons(); // TODO only update changed props
        }
    }

    private setFooterButtons = () => {
        this.context.setItem(1, {
            reset: this.props.onReset
        });


        this.context.setItem(2, {
            button: {
                text: "Exportieren",
                icon: faFileExport,
                callback: this.props.onExportClick
            }
        });

        this.context.setItem(3, {
            button: {
                callback: this.props.onSave,
                text: "Speichern",
                icon: faSave
            },
            disabled: this.props.isSaving
        });

        let nextButton: NextStepItem | ButtonItem = {
            nextStep: this.props.onNext,
            disabled: this.props.nextDisabled
        };
        if (this.props.customNextButton !== undefined) {
            nextButton = {
                button: {text: this.props.customNextButton.text, icon: faCaretRight, callback: this.props.onNext},
                disabled: this.props.nextDisabled,
            }
        }

        this.context.setItem(4, nextButton);
    }


    render() {
        if (!this.props.isMobile) {
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

        return null;
    }
}
