import {Component} from "react";
import {CompareAdapter} from "./Adapter/CompareAdapter";
import {CompareHeader} from "./Header/CompareHeader";

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
    header: CompareHeader
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
    fields: Array<SingleComparison & CompareValue>
}

class CompareComponent extends Component<CompareComponentProps, CompareComponentState> {

    constructor(props: Readonly<CompareComponentProps> | CompareComponentProps) {
        super(props);

        this.state = {
            fields: []
        }
    }

    render = () => {
        let header = this.props.header;

        return (
            <div>
                {this.renderHeader()}

                {this.state.fields.map((comparison, index) => {
                    return (
                        <div key={"field-" + index} className={"singleComparison"}>
                            <div>
                                <input type={"text"} disabled={true} readOnly={true} value={comparison.first} />
                            </div>
                            <div className={"comparisons"}>
                                {header.getHeaders().map((item, headerIndex) => {
                                    let checked = (comparison.value !== null) ? (parseInt(comparison.value) === headerIndex) : false;
                                    let value = (comparison.value !== null) ? ((parseInt(comparison.value) === headerIndex) ? comparison.value : headerIndex) : headerIndex;

                                    return (
                                        <div key={"field-" + index + "-" + value} className={"comparison"}>
                                            <input
                                                defaultChecked={checked}
                                                value={value}
                                                onChange={() => {
                                                    this.onRadioChange(index, headerIndex);
                                                }}
                                                disabled={this.props.disabled}
                                                type={"radio"}
                                                name={"field-" + index}
                                            />
                                        </div>
                                    );
                                })}
                            </div>
                            {comparison.second && (
                                <div>
                                    <input type={"text"} disabled={true} readOnly={true} value={comparison.second} />
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
        this.setState(state => {
            let fields = state.fields;
            fields[index].value = String(headerIndex);
            fields[index].header = this.props.header.getHeader(headerIndex);

            return {
                fields: fields
            }
        });
    }

    renderHeader = () => {
        if ((this.props.showHeader !== undefined && this.props.showHeader) || (this.props.showHeader === undefined)) {
            return (
                <div className={"singleComparison header"}>
                    <div/>
                    <div className={"comparisons"}>
                        {this.props.header.getHeaders().map((value) => {
                            return (
                                <div key={"header-" + value} className={"comparison"}>
                                    {value}
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

    componentDidMount() {
        let fields: Array<SingleComparison & CompareValue> = [];
        let values = this.props.values;

        for (let i = 0; i < this.props.fields.getLength(); i++) {
            let field = this.props.fields.getEntry(i);

            let value, header, comparisonValue;
            if (values) {
                comparisonValue = values[i];
                if (comparisonValue !== undefined) {
                    header = comparisonValue.header;
                    if (comparisonValue.value !== "") {
                        value = comparisonValue.value;
                    }
                }
            }

            fields.push({
                first: field.first,
                second: field.second,
                value: (value === undefined) ? null : value,
                header: (header === undefined) ? null : header,
            });
        }

        this.setState({
            fields: fields
        });
    }

}

export {
    CompareComponent
};
