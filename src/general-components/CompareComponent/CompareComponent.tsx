import {Component} from "react";
import {CompareAdapter} from "./Adapter/CompareAdapter";
import {CompareHeader, CompareHeaderAdapter} from "./Header/CompareHeaderAdapter";

import "./compare-component.scss";
import {HoverWindow} from "../HoverWindow/HoverWindow";


/**
 * Stellt einen einzelne Value da, welche dann letztendlich als Array, zusammen mit dem SingleComparison, die Values vom Comparecomponent darstellt
 */
type CompareValue = {
    value: null | string,
    header: null | string,
};
type CompareComponentValues = {
    comparisons: CompareValue[],
    headers: CompareHeader[]
}

export interface CompareComponentProps {
    /**
     * Die CompareHeader instanz, welche genutzt wird, um die Überschriften zu rendern und anzugeben wie viele auswahlmöglichkeiten es pro Kombination gibt
     */
    header: CompareHeaderAdapter
    /**
     * Gibt an ob die Überschriften, welche durch den header beschrieben wird, angezeigt werden sollen
     */
    showHeader?: boolean
    /**
     * Die CompareAdapter instanz, welche beschreibt welche kombinationen möglich sind
     */
    fields: CompareAdapter
    /**
     * Die Werte die angezeigt werden sollen
     */
    values: CompareComponentValues
    /**
     * Gibt an ob die Werte veränderbar sind oder nicht
     */
    disabled: boolean
    /**
     * Gibt an welche Comparisons deaktiviert sein sollen.
     */
    disabledComparisons?: number[]
    /**
     * Name um zwischen CompareComponents besser unterscheiden zu können
     */
    name?: string
    /**
     * Wird aufgerufen, wenn sich irgendein wert der values ändert
     * @param values {CompareComponentValues} ein neues array mit den aktuellen werten
     */
    onChanged: (values: CompareComponentValues) => void
}

/**
 * Wird zusammen mit dem CompareValue zusammengemerged um somit die Values vom CompareComponent zu repräsentieren
 */
export interface SingleComparison {
    /**
     * Linke Auswahlmöglichkeit
     */
    first: string
    /**
     * Beschreibung der linken Auswahlmöglichkeit
     */
    firstDesc?: string
    /**
     * Rechte Auswahlmöglichkeit, wenn sie fehlt wird nichts angezeigt
     */
    second?: string
    /**
     * Beschreibung der rechten Auswahlmöglichkeit
     */
    secondDesc?: string
}

interface CompareComponentState {
}

class CompareComponent extends Component<CompareComponentProps, CompareComponentState> {

    render = () => {
        let header = this.props.header;
        let name = this.props.name;

        return (
            <div className={"fullComparison"}>
                {this.renderHeader()}

                {this.props.values.comparisons.map((comparison, index) => {
                    const compMeta = this.props.fields.getEntry(index);
                    const firstName = (<div className={"first"}>
                        {compMeta.first}
                    </div>);
                    const secondName = compMeta.second && (<div className={"second"}>
                        {compMeta.second}
                    </div>);
                    return (
                        <div key={"field-" + name + index} className={"singleComparison"}>

                            {compMeta.firstDesc ? (
                                <HoverWindow description={compMeta.firstDesc}>
                                    {firstName}
                                </HoverWindow>
                            ) : firstName}
                            <div className={"comparisons"}>
                                {header.getHeaders().map((item, headerIndex) => {
                                    let checked = (comparison.value !== null) ? (parseInt(comparison.value) === headerIndex) : false;
                                    let value = (comparison.value !== null) ? comparison.value : undefined;

                                    let disabledExtraDescription = false;
                                    if (this.props.disabledComparisons) {
                                        disabledExtraDescription = !this.props.disabledComparisons.includes(headerIndex + 1);
                                    }

                                    return (
                                        <div key={"field-" + name + "-" + index + "-" + headerIndex}
                                             className={"comparison"}>
                                            {/*TODO onChanged event abgreifen und am namen festmachen welches geändert werden muss*/}
                                            <input
                                                checked={checked}
                                                value={value}
                                                onChange={this.onRadioChange.bind(this, index, headerIndex)}
                                                disabled={this.props.disabled || disabledExtraDescription}
                                                type={"radio"}
                                                name={"field-" + name + "-" + index}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            {secondName && compMeta.secondDesc ? (
                                <HoverWindow description={compMeta.secondDesc}>
                                    {secondName}
                                </HoverWindow>
                            ) : secondName}
                        </div>
                    );
                })}
            </div>
        );
    }

    /**
     * Wird ausgeführt wenn ein neuer Vergleich vom Benutzer ausgefüllt wird
     *
     * @param {number} index der index vom ausgewählten Vergleich
     * @param {number} headerIndex der index vom ausgewählten Header
     */
    onRadioChange = (index: number, headerIndex: number) => {
        const fields = this.props.values.comparisons.slice();
        fields[index] = {
            value: String(headerIndex),
            header: this.props.header.getHeader(headerIndex).header
        };
        this.props.onChanged({
            comparisons: fields,
            headers: this.props.header.getHeaders()
        });
    }

    renderHeader = () => {
        if ((this.props.showHeader !== undefined && this.props.showHeader) || (this.props.showHeader === undefined)) {
            return (
                <div className={"singleComparison header " + this.props.header.getClassName()}>
                    <div/>
                    <div className={"comparisons"}>
                        {this.props.header.getHeaders().map((value, headerIndex) => {
                            return (
                                <div
                                    key={"header-" + value.header}
                                    aria-disabled={!this.props.disabledComparisons?.includes(headerIndex + 1)}
                                    className={"comparison"}
                                >
                                    {value.header}
                                </div>
                            );
                        })}
                    </div>
                    {(this.props.fields.getEntry(0).second !== undefined) && <div/>}
                </div>
            );
        }
        return null;
    }

}

export {
    CompareComponent
};

export type{
    CompareValue,
    CompareComponentValues
}
