import {Component, FormEvent} from "react";
import {CardComponentField} from "../CardComponent";

export interface CustomDescriptionComponentProps {
    /**
     * Gibt an ob die Beschreibung deaktiviert sein soll oder nicht
     */
    disabled?: boolean
    /**
     * Die Value mit denen die Beschreibung aufgebaut werden soll
     */
    value?: CardComponentField
    /**
     * Der Name des Input-Feldes
     */
    name?: string
    /**
     * Der Index des Item aus dem CardComponent. Gibt somit auch an zu welchem Item aus dem CardComponent die Beschreibung dazugehört
     */
    index?: number
}

/**
 * Ein Component zum einbinden einer benutzerdefinierten Beschreibung beim CardComponent.
 * So lassen sich sonstige Beschreibungsmöglichkeiten modular einbinden.
 */
abstract class CustomDescriptionComponent<V, P, S> extends Component<P & CustomDescriptionComponentProps, S> {

    /**
     * extrahiert eine einzelne Beschreibung für ein Item aus dem CardComponent.
     * Der Parameter e enthält somit auch die Daten für das CardComponent
     *
     * @param {number} index Der Index des Items des CardComponents
     * @param {React.FormEvent<HTMLFormElement>} e Das HTML-Formular welches die Daten enthält
     * @returns {V} Typparameter, welche die Values darstellen soll.
     */
    public abstract extractSingle(index: number, e: FormEvent<HTMLFormElement>): V;

}


export {
    CustomDescriptionComponent
}
