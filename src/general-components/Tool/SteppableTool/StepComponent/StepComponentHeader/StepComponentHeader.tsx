import React, {PureComponent} from "react";
import {Tool} from "../../../Tool";
import {isDesktop} from "../../../../Desktop";
import {Collapse, Form} from "react-bootstrap";

import "./step-header.scss";
import {SharedSaveContext} from "../../../../Contexts/SharedSaveContextComponent";
import {EditSavesPermission, hasPermission} from "../../../../Permissions";


export interface StepComponentHeaderProp {
    tool: Tool<any>
    saveName: string
    saveDescription: string
    saveMetaChanged: (name: string, description: string) => void
}

export interface StepComponentState {
    showStepHeaderDesc: boolean
}

export class StepComponentHeader extends PureComponent<StepComponentHeaderProp, StepComponentState> {
    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = SharedSaveContext;
    context!: React.ContextType<typeof SharedSaveContext>

    constructor(props: StepComponentHeaderProp, context: any) {
        super(props, context);
        this.state = {
            showStepHeaderDesc: isDesktop()
        }
    }

    render() {
        return (
            <div className={"stepHeaderContainer"}>
                <div className={"toolName"}>
                    {this.props.tool.getToolName()}
                </div>
                <div className={"stepHeader form"}>
                    <Form.Control
                        type={"text"}
                        value={this.props.saveName}
                        onChange={this.onChangeCurrentName}
                        onFocus={this.showDescription}
                        onBlur={this.showDescriptionIfDesktop}
                        disabled={!hasPermission(this.context.permission, EditSavesPermission)}
                    />

                    <Collapse in={this.state.showStepHeaderDesc}>
                        <div>
                            <Form.Control
                                type={"textarea"}
                                as={"textarea"}
                                onFocus={this.showDescription}
                                onBlur={this.showDescriptionIfDesktop}
                                value={this.props.saveDescription}
                                onChange={this.onChangeCurrentDescription}
                                disabled={!hasPermission(this.context.permission, EditSavesPermission)}
                            />
                        </div>
                    </Collapse>
                </div>
            </div>
        );
    }

    onChangeCurrentName = (e: { currentTarget: { value: string; }; }) => {
        const name = e.currentTarget.value;
        this.props.saveMetaChanged(name, this.props.saveDescription);
    }

    onChangeCurrentDescription = (e: { currentTarget: { value: string; }; }) => {
        const description = e.currentTarget.value;
        this.props.saveMetaChanged(this.props.saveName, description);
    }

    private showDescription = () => {
        this.setState({
            showStepHeaderDesc: true
        });
    }

    private showDescriptionIfDesktop = () => {
        this.setState({
            showStepHeaderDesc: isDesktop()
        });
    }
}
