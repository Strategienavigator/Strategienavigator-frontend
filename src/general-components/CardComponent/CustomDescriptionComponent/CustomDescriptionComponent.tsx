import {Component} from "react";

export interface CustomDescriptionComponentProps<D> {
    /**
     * Gibt an ob die Beschreibung deaktiviert sein soll oder nicht
     */
    disabled: boolean
    /**
     * Die Value mit denen die Beschreibung aufgebaut werden soll
     */
    value: D
    /**
     * Der Name des Input-Feldes
     */
    name: string
    /**
     * callback wenn sich die value ändern soll
     * @param value {D} neue instanz von type D
     */
    onChanged: (value:D) => void
}

/**
 * Ein Component zum einbinden einer benutzerdefinierten Beschreibung beim CardComponent.
 * So lassen sich sonstige Beschreibungsmöglichkeiten modular einbinden.
 */
abstract class CustomDescriptionComponent<V, S> extends Component<CustomDescriptionComponentProps<V>, S> {
}


export {
    CustomDescriptionComponent
}
