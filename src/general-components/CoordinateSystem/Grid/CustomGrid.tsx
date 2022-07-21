import {ReactElement} from "react";


/**
 * Stellt ein CustomGrid dar, welches dem Koordinatensystem dient.
 * Somit kann ein eigenes Grid im Koordinatensystem dargestellt werden.
 */
abstract class CustomGrid {
    private classNames = ["grid-overlay"];

    protected constructor(classNames?: string[]) {
        if (classNames)
            this.classNames = this.classNames.concat(classNames);
    }

    public render() {
        return (
            <div className={this.classNames.join(" ")}>
                {this.getItems()}
            </div>
        );
    }

    /**
     * Fügt eine CSS-Klasse zum Container hinzu
     *
     * @param {string} className CSS-Klasse
     */
    protected addClassName = (className: string) => {
        this.classNames.push(className);
    }

    /**
     * Gibt die Items des CustomGrids zurück
     *
     * @returns {React.ReactElement[]} Die Items des Grids
     * @protected
     */
    protected abstract getItems(): ReactElement[];

}

export {
    CustomGrid
}