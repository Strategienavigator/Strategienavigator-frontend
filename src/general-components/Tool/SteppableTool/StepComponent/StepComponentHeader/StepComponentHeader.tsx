import {Component, PureComponent} from "react";
import {Tool} from "../../../Tool";
import {isDesktop} from "../../../../Desktop";
import {Collapse} from "react-bootstrap";
import {Form} from "react-bootstrap";

import "./step-header.scss";
import {ToolSaveProps} from "../../../ToolSavePage/ToolSavePage";


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
                            />
                        </div>
                    </Collapse>
                </div>
            </div>
        );
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

    onChangeCurrentName = (e: { currentTarget: { value: string; }; }) => {
        const name = e.currentTarget.value;
        this.props.saveMetaChanged(name, this.props.saveDescription);
    }

    onChangeCurrentDescription = (e: { currentTarget: { value: string; }; }) => {
        const description = e.currentTarget.value;
        this.props.saveMetaChanged(this.props.saveName, description);
    }
}
