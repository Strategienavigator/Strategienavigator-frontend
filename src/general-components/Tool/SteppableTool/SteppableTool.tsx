import {Tool} from "../Tool";

import "./steppable-tool.scss";
import StepComponent, {StepComponentProps, StepProp} from "./StepComponent/StepComponent";
import React, {Component, ReactComponentElement, ReactNode, RefObject} from "react";
import {RouteComponentProps, StaticContext} from "react-router";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {SaveResource} from "../../Datastructures";
import {ToolSavePage, ToolSaveProps} from "../ToolSavePage/ToolSavePage";


abstract class SteppableTool<D> extends Tool<D> {

    // STEP COMPONENT
    private steps: Array<StepProp<any>> = [];

    // Matrix
    private matrix?: ReactComponentElement<any>;


    constructor(props: RouteComponentProps, context: any, toolName: string, toolIcon: IconDefinition, toolID: number) {
        super(props, context, toolName, toolIcon, toolID);
    }

    public onAPIError(error: Error) {

    }

    protected setMatrix(matrix: ReactComponentElement<any>) {
        this.matrix = matrix;
    }

    protected addStep<E>(step: StepProp<E>) {
        this.steps.push(step);
    }

    protected getStepComponent(saveProps: ToolSaveProps<D>) {
        let props: StepComponentProps<D> & React.ComponentProps<any> = {
            key: "stepComponent",
            matrix: this.matrix,
            steps: this.steps,
            tool: this,
            ...saveProps
        }

        return React.createElement(StepComponent, props, null)

    }
}

export {
    SteppableTool
}
