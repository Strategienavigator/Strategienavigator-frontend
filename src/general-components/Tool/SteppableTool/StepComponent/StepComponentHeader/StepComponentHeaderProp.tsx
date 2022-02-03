import {Component} from "react";
import {Tool} from "../../../Tool";
import {isDesktop} from "../../../../Desktop";
import {Collapse} from "react-bootstrap";
import {Form} from "react-bootstrap";

import "./step-header.scss";
import {ToolSaveProps} from "../../../ToolSavePage/ToolSavePage";


export interface StepComponentHeaderProp extends ToolSaveProps<any>{
    tool: Tool<any>
}

export interface StepComponentState {
    showStepHeaderDesc:boolean
}

export class StepComponentHeader extends Component<StepComponentHeaderProp, StepComponentState> {

    constructor(props: StepComponentHeaderProp, context: any) {
        super(props, context);
        this.state={
            showStepHeaderDesc:isDesktop()
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
                        defaultValue={this.props.save.name}
                        onChange={this.onChangeCurrentName}
                        onFocus={() => {
                            this.setState({
                                showStepHeaderDesc: true
                            });
                        }}
                        onBlur={() => {
                            this.setState({
                                showStepHeaderDesc: isDesktop()
                            });
                        }}
                    />

                    <Collapse in={this.state.showStepHeaderDesc}>
                        <div>
                            <Form.Control
                                type={"textarea"}
                                as={"textarea"}
                                onFocus={() => {
                                    this.setState({
                                        showStepHeaderDesc: true
                                    });
                                }}
                                onBlur={() => {

                                    this.setState({
                                        showStepHeaderDesc: isDesktop()
                                    });

                                }}
                                defaultValue={this.props.save.description}
                                onChange={this.onChangeCurrentDescription}
                            />
                        </div>
                    </Collapse>
                </div>
            </div>
        );
    }

    onChangeCurrentName = (e: { currentTarget: { value: string; }; }) => {
        const newSave = this.props.save;
        newSave.name = e.currentTarget.value;
        this.props.saveController.onChanged(newSave);
    }

    onChangeCurrentDescription = (e: { currentTarget: { value: string; }; }) => {
        const newSave = this.props.save;
        newSave.description = e.currentTarget.value;
        this.props.saveController.onChanged(newSave);
    }
}
