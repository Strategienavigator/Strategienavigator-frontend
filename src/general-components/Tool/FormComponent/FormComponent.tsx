import {Component, FormEvent, ReactNode} from "react";
import {Form} from "react-bootstrap";
import {Messages} from "../../Messages/Messages";
import StepComponent from "../StepComponent/StepComponent";
import {randomBytes} from "crypto";
import {Tool} from "../Tool";


export interface FormComponentProps {
    id?: string
    title?: string
    stepComp?: StepComponent
    tool?: Tool
}

export interface ResetType {
    all: boolean
    same: boolean
}

export abstract class FormComponent<V, S> extends Component<FormComponentProps, S> {
    protected values: V | object = {};
    protected disabled: boolean = false;
    private error: Map<string, ReactNode[]> = new Map<string, ReactNode[]>();
    private key: string = randomBytes(200).toString();
    private buildValues: boolean = false;

    public componentDidMount = async () => {
        await this.buildPreviousValues();
        this.buildValues = true;
        this.forceUpdate();
    }

    public render = () => {
        return (
            <Form key={this.key} aria-disabled={this.disabled} name={this.props.id}
                  onSubmit={(e) => this.onFormSubmit(e)}
                  id={this.props.id}>
                {this.buildValues && this.build()}
            </Form>
        );
    }

    public reset = (type: ResetType): void => {
        this.values = {};
        this.disabled = false;
        this.error.clear();
        this.key = randomBytes(200).toString();
        this.onReset(type);
        this.changeControlFooter();
        this.forceUpdate();
    }

    public abstract buildPreviousValues(): Promise<void>;

    public abstract rebuildValues(values: V): Promise<void>;

    public abstract build(): JSX.Element;

    public abstract onReset(type: ResetType): void;

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
                        <div key={"feedback-" + id} className={"feedback DANGER"}>
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

        if (this.validate(newValues)) {
            this.values = newValues;
            await this.submit(newValues);

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
