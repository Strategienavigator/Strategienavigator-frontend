import {Component, FormEvent, ReactNode} from "react";

import {Form as BootstrapForm} from "react-bootstrap";
import StepComponent from "../StepComponent/StepComponent";
import {Messages} from "../Messages/Messages";

export type classType = new (...args: any[]) => any;

abstract class Form<E> extends Component<any, any> {
    protected values: E | undefined;
    private readonly id: string;
    private validated: boolean = false;
    private stepComponent: StepComponent<any, any>;

    public constructor(stepComponent: StepComponent<any, any>, id: string, values?: E) {
        super(undefined);
        this.stepComponent = stepComponent;
        this.id = id;

        if (values !== undefined) {
            this.setValues(values);
        } else {
            this.buildValues();
        }
    }

    public abstract build(): ReactNode;

    public abstract submit(values: E): boolean | void;

    public abstract validate(values: E): boolean;

    public abstract extractValues(e: FormEvent<HTMLFormElement>): E;

    public abstract buildValues(): void;

    public getCompletedStep(formClass: classType) {
        return this.stepComponent.getCompletedStep(formClass.name);
    }

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

    public setValues = (values: E) => {
        this.values = values;
    }

    private handleForm = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        let values = this.extractValues(e);
        let validate: boolean = this.validate(values);
        this.validated = validate;

        if (validate) {
            this.submit(values);
            this.values = values;

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