import {Component, FormEvent, ReactNode} from "react";
import {Form} from "react-bootstrap";
import {Messages} from "../../Messages/Messages";
import {randomBytes} from "crypto";
import {Tool} from "../Tool";


export interface FormComponentProps {
    /**
     * Die ID des Formulares. Muss einzigartig sein!
     */
    id?: string
    /**
     * Titel des Formulars
     */
    title?: string
    /**
     * Die Instanz des Tools zu dem das Formular gehört
     */
    tool?: Tool
}

export interface ResetType {
    /**
     * Sollen alle zurückgesetzt werden?
     */
    all: boolean
    /**
     * Soll nur der Schritt zurückgesetzt werden, auf dem sich der Benutzer gerade befindet?
     */
    same: boolean
}

/**
 * Stellt ein einzelnes Formular dar.
 */
export abstract class FormComponent<V, P, S> extends Component<FormComponentProps & P, S> {
    public isSaving: boolean = false;
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

    /**
     * Methode zum Überprüfen ob sich das FormComponent momentan im Speichervorgang befindet
     *
     * @param {boolean} saving
     */
    public setIsSaving(saving: boolean) {
        this.isSaving = saving;
    }

    public render = () => {
        return (
            <Form key={this.key} aria-disabled={this.disabled} name={this.props.id}
                  onSubmit={async (e) => {
                      e.preventDefault();
                      await this.onFormSubmit(e);
                  }}
                  id={this.props.id}>
                {this.buildValues && this.build()}
            </Form>
        );
    }

    /**
     * Methode zum zurücksetzen der FormComponent
     *
     * @param {ResetType} type
     */
    public reset = (type: ResetType): void => {
        this.values = {};
        this.disabled = false;
        this.error.clear();
        this.key = randomBytes(200).toString();
        this.onReset(type);
        this.changeControlFooter();
        this.forceUpdate();
    }

    /**
     * Wird aufgerufen, wenn auf weiter geklickt wurde.
     * Somit kann man die Werte für das Formular mit den vorherigen aufbauen.
     *
     * @returns {Promise<void>}
     */
    public abstract buildPreviousValues(): Promise<void>;

    /**
     * Baut das Formular mit den mitgegebenen Werten auf.
     *
     * @param {V} values Die Werte vom Typ V
     * @returns {Promise<void>}
     */
    public abstract rebuildValues(values: V): Promise<void>;

    /**
     * Baut die HTML für den Schritt.
     * Muss ein JSX.Element zurückgeben.
     *
     * @returns {JSX.Element} Das Element welches die HTML enthält
     */
    public abstract build(): JSX.Element;

    /**
     * Wird aufgerufen, wenn der Schritt zurückgesetzt wird.
     *
     * @param {ResetType} type Gibt an, von welchem Typ des Resets es sich handelt
     */
    public abstract onReset(type: ResetType): void;

    /**
     * Wird aufgerufen wenn das Formular validiert wird.
     *
     * @param {V} values Die Werte des Benutzers
     * @returns {boolean} Valide oder nicht?
     */
    public abstract validate(values: V): boolean;

    /**
     * Wird aufgerufen, wenn die Validierung überstanden ist und die Werte nun abgespeichert werden sollen.
     * Wichtig: Die Speicherung wird automatisch übernommen, allerdings kann diese Funktion für externe Speicherungsvarianten benutzt werden.
     *
     * @param {V} values Die Werte
     * @returns {Promise<void>}
     */
    public abstract submit(values: V): Promise<void>;

    /**
     * Extrahiert die vom Benutzer übermittelten Werte und transformiert diese zu einem Objekt vom Typ V.
     *
     * @param {React.FormEvent<HTMLFormElement>} e HTML-Formular welches die Werte enthält
     * @returns {V} Die transformierten Werte
     */
    public abstract extractValues(e: FormEvent<HTMLFormElement>): V;

    /**
     * Methode zum Verändern des ControlFooter.
     * Hier können indivuelle Anpassungen vorgenommen werden.
     */
    public abstract changeControlFooter(): void;

    /**
     * Getter für die Werte des FormComponent
     *
     * @returns {object | V}
     */
    public getValues = (): V | object => {
        return this.values;
    }

    /**
     * Setter für die Werte des FormComponents
     *
     * @param {object} values
     */
    public setValues = (values: object) => {
        if (values !== undefined && values !== null) {
            this.values = Object.assign(this.values, values);
        }
    }

    /**
     * Methode zum überprüfen ob das FormComponent Werte enthält
     *
     * @returns {boolean}
     */
    public hasValues = (): boolean => {
        return this.values !== {};
    }

    /**
     * Setter für den disabled boolean
     *
     * @param {boolean} disabled
     */
    public setDisabled = (disabled: boolean) => {
        this.disabled = disabled;
        this.forceUpdate();
    }

    /**
     * Methode zum überprüfen des boolean disabled
     *
     * @returns {boolean}
     */
    public isDisabled = (): boolean => {
        return this.disabled;
    }

    /**
     * Methode um das FormCompoonent abzuschicken
     */
    public triggerFormSubmit = () => {
        let element = document.getElementById(this.props.id as string) as HTMLFormElement | null;
        if (element) {
            element.requestSubmit();
        }
    }

    /**
     * Methode um einen Error hinzuzufügen
     *
     * @param {string} id
     * @param {React.ReactNode} error
     */
    public addError = (id: string, error: ReactNode) => {
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

    /**
     * Methode um einen darzustellen
     *
     * @param {string} id
     * @returns {React.ReactNode}
     */
    public getError = (id: string): ReactNode => {
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

    /**
     * Methode zum Überprüfen ob ein Error vorhanden ist
     *
     * @param {string} id
     * @returns {boolean}
     */
    public hasError = (id: string): boolean => {
        return this.error.has(id);
    }

    /**
     * Methode welche des Verhalten beim Absenden des FromComponent bestimmt
     *
     * @param {React.FormEvent<HTMLFormElement>} e
     * @returns {Promise<void>}
     */
    protected onFormSubmit = async (e: FormEvent<HTMLFormElement>) => {
        let newValues = this.extractValues(e);
        this.values = newValues;

        if (this.isSaving) {
            this.isSaving = false;
        } else {
            // is nextstep
            if (this.validate(newValues)) {
                await this.submit(newValues);
            } else {
                Messages.add(
                    "Bitte überprüfen Sie vorher Ihre Eingaben!",
                    "DANGER",
                    Messages.TIMER
                );
            }
        }
    }

}
