import {Tool} from "../Tool";

import "./steppable-tool.scss";
import StepComponent, {StepComponentProps, StepDefinition} from "./StepComponent/StepComponent";
import React, {
    Attributes,
    ClassAttributes,
    Component,
    ComponentProps,
    ReactComponentElement,
    ReactNode,
    RefObject
} from "react";
import {RouteComponentProps, StaticContext} from "react-router";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {SaveResource} from "../../Datastructures";
import {ToolSavePage, ToolSaveProps} from "../ToolSavePage/ToolSavePage";
import {type} from "os";


abstract class SteppableTool<D extends object> extends Tool<D> {

    // STEP COMPONENT
    private steps: Array<StepDefinition<any>> = [];

    private readonly typeStepComponent;


    protected constructor(props: RouteComponentProps, context: any, toolName: string, toolIcon: IconDefinition, toolID: number) {
        super(props, context, toolName, toolIcon, toolID);
        this.typeStepComponent = class TypeStepComponent extends StepComponent<D> {
        };
    }

    protected addStep<E extends object>(step: StepDefinition<E>) {
        this.steps.push(step);
    }

    protected getStepComponent(saveProps: ToolSaveProps<D>) {
        type stepProps = StepComponentProps<D> & ClassAttributes<StepComponent<D>>;
        let props: stepProps = {
            key: "stepcomponent",
            steps: this.steps,
            tool: this,
            ...saveProps
        };

        let typesProps = props as stepProps;


        return React.createElement(this.typeStepComponent, typesProps, null);

    }

    public getStep(index: number) {
        return this.steps[index];
    }


    protected buildSaveBuilder(saveProps: ToolSaveProps<D>): JSX.Element {
        return this.getStepComponent(saveProps);
    }
}

export {
    SteppableTool
}
