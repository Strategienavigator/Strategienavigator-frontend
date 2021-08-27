import {Component, FormEvent, ReactNode} from "react";
import {Form} from "react-bootstrap";
import {Messages} from "../Messages/Messages";
import StepComponent from "../StepComponent/StepComponent";

import "../../scss/feedback.scss";
import {randomBytes} from "crypto";

interface FormComponentProps {
    id?: string,
    title?: string,
    stepComp?: StepComponent
}

abstract class FormComponent<V, S> extends Component<FormComponentProps, S> {
    protected values: V | object = {};
    protected disabled: boolean = false;
    private error: Map<string, ReactNode[]> = new Map<string, ReactNode[]>();
    private key: string = randomBytes(200).toString();

    public componentDidMount = async () => {
        await this.prepareValues();
        this.forceUpdate();
    }

    public render = () => {
        return (
            <Form key={this.key} aria-disabled={this.disabled} name={this.props.id}
                  onSubmit={(e) => this.onFormSubmit(e)}
                  id={this.props.id}>
                {this.build()}
            </Form>
        );
    }

    public reset = (): void => {
        this.values = {};
        this.disabled = false;
        this.error.clear();
        this.key = randomBytes(200).toString();

        this.forceUpdate();
    }

    public abstract prepareValues(): Promise<void>;

    public abstract build(): JSX.Element;

    public abstract validate(values: V): boolean;

    public abstract submit(values: V): Promise<void>;

    public abstract extractValues(e: FormEvent<HTMLFormElement>): V;

    public abstract changeControlFooter(): void;

    public getValues = (): V | object => {
        return this.values;
    }

    public setValues = (values: object) => {
        if (values !== undefined && values !== null) {
            this.values = Object.assign(this.values, values);
        }
    }

    public hasValues = (): boolean => {
        return this.values !== {};
    }

    public setDisabled = (disabled: boolean) => {
        this.disabled = disabled;
        this.forceUpdate();
    }

    public isDisabled = (): boolean => {
        return this.disabled;
    }

    protected addError = (id: string, error: ReactNode) => {
        let errorArray = this.error.get(id);

        if (errorArray === undefined) {
            this.error.set(id, []);
        }

        errorArray = this.error.get(id);
        errorArray?.push(error);
        this.error.set(id, errorArray as ReactNode[]);

        this.forceUpdate(() => {
            this.error.delete(id);
        });
    }

    protected getError = (id: string): ReactNode => {
        return (
            <div className={"feedbackContainer"}>
                {this.error.get(id)?.map((value) => {
                    return (
                        <div className={"feedback DANGER"}>
                            {value}
                        </div>
                    );
                })}
            </div>
        );
    }

    protected hasError = (): boolean => {
        return false;
    }

    private onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let newValues = this.extractValues(e);

        if (this.disabled) {
            this.props.stepComp?.nextStep();
        } else {
            if (this.validate(newValues)) {
                await this.submit(newValues);
                this.values = newValues;

                if (this.props.stepComp?.isLastStep()) {
                    if (await this.props.stepComp.onSave()) {
                        Messages.add(<span>Das Tool wurde erfolgreich abgespeichert!</span>, "SUCCESS", Messages.TIMER);
                    } else {
                        Messages.add(
                            <span>Beim Abspeichern des Tools ist ein Fehler aufgetreten!</span>, "DANGER", Messages.TIMER);
                    }
                } else {
                    this.props.stepComp?.nextStep();
                }
            } else {
                Messages.add(
                    <span>In Ihren Eingaben befinden sich Fehler!<br/> Bitte überprüfen Sie diese erneut.</span>, "DANGER", Messages.TIMER);
            }
        }
    }

}

export default FormComponent;