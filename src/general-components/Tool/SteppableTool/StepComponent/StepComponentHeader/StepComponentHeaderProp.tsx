import {Component} from "react";
import {Tool} from "../../../Tool";
import {isDesktop} from "../../../../Desktop";
import {Collapse} from "react-bootstrap";
import {Form} from "react-bootstrap";


export interface StepComponentHeaderProp {
    tool: Tool
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
            <div className={"stepHeader"}>
                <Form.Control
                    type={"text"}
                    defaultValue={this.props.tool.getCurrentSave()?.name}
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
                            defaultValue={this.props.tool.getCurrentSave()?.description}
                            onChange={this.onChangeCurrentDescription}
                        />
                    </div>
                </Collapse>
            </div>
        );
    }

    onChangeCurrentName = (e: { currentTarget: { value: string; }; }) => {
        this.props.tool?.setCurrentSaveName(e.currentTarget.value);
    }

    onChangeCurrentDescription = (e: { currentTarget: { value: string; }; }) => {
        this.props.tool?.setCurrentSaveDescription(e.currentTarget.value);
    }
}
