import {Component, FormEvent} from "react";
import {CardComponentField, CardComponentFields} from "../CardComponent";

export interface CustomDescriptionComponentProps {
    disabled?: boolean
    value?: CardComponentField
    name?: string
    index?: number
}


abstract class CustomDescriptionComponent<V, P, S> extends Component<P & CustomDescriptionComponentProps, S> {

    public abstract extractSingle(index: number, e: FormEvent<HTMLFormElement>): V;

}


export {
    CustomDescriptionComponent
}
