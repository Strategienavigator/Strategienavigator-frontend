import {Component} from "react";
import {CompareAdapter} from "./Adapter/CompareAdapter";
import {CompareHeaderAdapter} from "./Header/CompareHeaderAdapter";

import "./compare-component.scss";


/**
 * Stellt einen einzelne Value da, welche dann letztendlich als Array, zusammen mit dem SingleComparison, die Values vom Comparecomponent darstellt
 */
type CompareValue = {
    value: null | string,
    header: null | string,
};

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
    values: CompareValue[]
    /**
     * Gibt an ob die Werte veränderbar sind oder nicht
     */
    disabled: boolean

    /**
     * Wird aufgerufen, wenn sich irgendein wert der values ändert
     * @param values {CompareValue[]} ein neues array mit den aktuellen werten
     */
    onChanged: (values: CompareValue[]) => void
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
     * Rechte Auswahlmöglichkeit, wenn sie fehlt wird nichts angezeigt
     */
    second?: string
}

interface CompareComponentState {
}

class CompareComponent extends Component<CompareComponentProps, CompareComponentState> {


    render = () => {
        let header = this.props.header;


        return (
            <div>
                {this.renderHeader()}

                {this.props.values.map((comparison, index) => {
                    const compMeta = this.props.fields.getEntry(index);
                    return (
                        <div key={"field-" + index} className={"singleComparison"}>
                            <div>
                                <input type={"text"} disabled={true} readOnly={true} value={compMeta.first}/>
                            </div>
                            <div className={"comparisons"}>
                                {header.getHeaders().map((item, headerIndex) => {
                                    let checked = (comparison.value !== null) ? (parseInt(comparison.value) === headerIndex) : false;
                                    let value = (comparison.value !== null) ? ((parseInt(comparison.value) === headerIndex) ? comparison.value : headerIndex) : headerIndex;

                                    return (
                                        <div key={"field-" + index + "-" + value} className={"comparison"}>
                                            {/*TODO onChanged event abgreifen und am namen festmachen welches geändert werden muss*/}
                                            <input
                                                defaultChecked={checked}
                                                value={value}
                                                onChange={this.onRadioChange.bind(this, index, headerIndex)}
                                                disabled={this.props.disabled}
                                                type={"radio"}
                                                name={"field-" + index}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            {compMeta.second && (
                                <div>
                                    <input type={"text"} disabled={true} readOnly={true} value={compMeta.second}/>
                                </div>
                            )}
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
        const fields = this.props.values.slice();
        fields[index] = {
            value: String(headerIndex),
            header: this.props.header.getHeader(headerIndex).header
        };
        this.props.onChanged(fields);
    }

    renderHeader = () => {
        if ((this.props.showHeader !== undefined && this.props.showHeader) || (this.props.showHeader === undefined)) {
            return (
                <div className={"singleComparison header"}>
                    <div/>
                    <div className={"comparisons"}>
                        {this.props.header.getHeaders().map((value) => {
                            return (
                                <div key={"header-" + value.header} className={"comparison"}>
                                    {value.header}
                                </div>
                            );
                        })}
                    </div>
                    <div/>
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
    CompareValue
}
