import {Tool} from "../Tool";

import "./steppable-tool.scss";
import StepComponent, {StepComponentProps, StepDefinition} from "./StepComponent/StepComponent";
import React, {Component, ReactComponentElement, ReactNode, RefObject} from "react";
import {RouteComponentProps, StaticContext} from "react-router";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {SaveResource} from "../../Datastructures";
import {ToolSavePage, ToolSaveProps} from "../ToolSavePage/ToolSavePage";


abstract class SteppableTool<D> extends Tool<D> {

    // STEP COMPONENT
    private steps: Array<StepDefinition<any>> = [];



    constructor(props: RouteComponentProps, context: any, toolName: string, toolIcon: IconDefinition, toolID: number) {
        super(props, context, toolName, toolIcon, toolID);
    }

    public onAPIError(error: Error) {

    }

    protected addStep<E>(step: StepDefinition<E>) {
        this.steps.push(step);
    }

    protected getStepComponent(saveProps: ToolSaveProps<D>) {
        let props: StepComponentProps<D> & React.ComponentProps<any> = {
            key: "stepComponent",
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
