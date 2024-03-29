import {Component} from "react";
import {Form} from "react-bootstrap";


export interface FormComponentProps {
    /**
     * Die ID des Formulares. Muss einzigartig sein!
     */
    id?: string
    /**
     * Bestimmt ob das Formular deaktiviert sein soll oder nicht
     */
    disabled: boolean
}

export abstract class FormComponent<P extends FormComponentProps, S> extends Component<P, S> {
    protected constructor(props: Readonly<P> | P);
    protected constructor(props: P, context: any);
    protected constructor(props: P | Readonly<P>, context?: any) {
        super(props, context);
    }

    public render = () => {
        return (
            <Form key={this.props.id} aria-disabled={this.props.disabled} name={this.props.id}
                  id={this.props.id}>

                {this.build()}
            </Form>
        );
    }

    protected abstract build(): JSX.Element;

}
