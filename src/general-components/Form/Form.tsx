import {Component, FormEvent, ReactNode} from "react";

import {Form as BootstrapForm} from "react-bootstrap";
import StepComponent from "../StepComponent/StepComponent";
import {Messages} from "../Messages/Messages";

abstract class Form<E> extends Component<any, any> {
    private readonly id: string;
    private validated: boolean = false;
    private stepComponent: StepComponent<any, any>;
    private values: E | undefined;

    public constructor(stepComponent: StepComponent<any, any>, id: string) {
        super(undefined);
        this.stepComponent = stepComponent;
        this.id = id;
    }

    public abstract build(): ReactNode;

    public abstract submit(e: FormEvent<HTMLFormElement>): boolean | void;

    public abstract validate(e: FormEvent<HTMLFormElement>): boolean;

    public abstract extractValues(e: FormEvent<HTMLFormElement>): E;

    public isValidated() {
        return this.validated;
    }

    public getID = (): string => {
        return this.id;
    }

    public render(): ReactNode {
        return (
            <BootstrapForm id={this.id} onSubmit={(e) => this.handleForm(e)}>
                {this.build()}
            </BootstrapForm>
        );
    }

    public hasValues = (): boolean => {
        return this.values !== undefined;
    }

    public getValues = (): E | undefined => {
        return this.values;
    }

    private handleForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let validate: boolean = this.validate(e);
        this.validated = validate;

        if (validate) {
            this.submit(e);
            this.values = this.extractValues(e);

            if (this.stepComponent.isLastStep()) {
                this.stepComponent.save(this.stepComponent.getSteps());
            } else {
                this.stepComponent.nextStep();
            }
        } else {
            Messages.add(
                <span>In Ihren Eingaben befinden sich Fehler!<br/> Bitte überprüfen Sie diese erneut.</span>, "DANGER", Messages.TIMER);
        }
    }

}

export default Form;