import {Tool} from "../Tool";

import "./steppable-tool.scss";
import StepComponent, {StepComponentProps, StepProp} from "./StepComponent/StepComponent";
import React, {ReactComponentElement, RefObject} from "react";
import {RouteComponentProps, StaticContext} from "react-router";


abstract class SteppableTool extends Tool {

    // STEP COMPONENT
    private steps: Array<StepProp<any>> = [];
    private readonly stepComponent: RefObject<StepComponent>;

    // Matrix
    private matrix?: ReactComponentElement<any>;

    protected constructor(props: RouteComponentProps<any, StaticContext, unknown> | Readonly<RouteComponentProps<any, StaticContext, unknown>>) {
        super(props);
        this.stepComponent = React.createRef<StepComponent>();
    }

    public onAPIError(error: Error) {

    }

    protected setMatrix(matrix: ReactComponentElement<any>) {
        this.matrix = matrix;
    }

    public setValues(id: string, values: any): boolean {
        for (let i = 0; i < this.steps.length; i++) {
            let step = this.steps[i];
            if (step.id.toLowerCase() === id.toLowerCase()) {
                step.values = values;
                return true;
            }
        }
        return false;
    }

    public getValues<D>(id: string): object | null {
        let values = null;

        for (let i = 0; i < this.steps.length; i++) {
            let step = this.steps[i];
            if (step.id.toLowerCase() === id.toLowerCase()) {
                values = this.stepComponent.current?.getFormValues<D>(id);
            }
        }

        return {
            [id]: values
        };
    }

    protected addStep<E>(step: StepProp<E>) {
        this.steps.push(step);
    }

    protected getStepComponent(props?: StepComponentProps) {
        return (
            <StepComponent
                onSave={async (data, forms) => {
                    return await this.save(data, forms);
                }}
                key={"stepComponent"}
                ref={this.stepComponent}
                matrix={this.matrix}
                steps={this.steps}
                tool={this}
                {...props}
            />
        );
    }
}

export {
    SteppableTool
}
