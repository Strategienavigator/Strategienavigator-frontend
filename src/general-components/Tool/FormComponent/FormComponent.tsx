import {Component, ReactNode} from "react";
import {Form} from "react-bootstrap";
import {randomBytes} from "crypto";


export interface FormComponentProps {
    id?: string
    disabled: boolean
}

export abstract class FormComponent<P extends FormComponentProps, S> extends Component<P, S> {

    private key: string = randomBytes(200).toString();

    public render = () => {
        return (
            <Form key={this.key} aria-disabled={this.props.disabled} name={this.props.id}
                  id={this.props.id}>

                {this.build()}
            </Form>
        );
    }


    protected abstract build():JSX.Element;

}
