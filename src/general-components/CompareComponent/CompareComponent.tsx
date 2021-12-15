import {Component} from "react";
import {CompareAdapter} from "./Adapter/CompareAdapter";
import {CompareHeader} from "./Header/CompareHeader";

import "./compare-component.scss";


interface CompareComponentProps {
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
    values: CompareAdapter
}

interface SingleComparison {
    /**
     * Linke Auswahlmöglichkeit
     */
    first: string
    /**
     * Rechte Auswahlmöglichkeit, wenn sie fehlt wird nichts angezeigt
     */
    second?: string
}

class CompareComponent extends Component<CompareComponentProps, any> {

    render = () => {
        let header = this.props.header;
        let values = this.props.values;
        // variable is used to group radio buttons together
        let field = -1;

        return (
            <div>
                {(this.props.showHeader !== undefined && this.props.showHeader) && (
                    <div className={"singleComparison header"}>
                        <div/>
                        <div className={"comparisons"}>
                            {header.getHeaders().map((value) => {
                                return (
                                    <div className={"comparison"}>
                                        {value}
                                    </div>
                                );
                            })}
                        </div>
                        <div/>
                    </div>
                )}
                {values.toArray().map((comparison) => {
                    field++;
                    return (
                        <div className={"singleComparison"}>
                            <div>
                                {comparison.first}
                            </div>
                            <div className={"comparisons"}>
                                {header.getHeaders().map((value) => {
                                    return (
                                        <div className={"comparison"}>
                                            <input type={"radio"} name={"field-" + field}/>
                                        </div>
                                    );
                                })}
                            </div>
                            {comparison.second && (
                                <div>
                                    {comparison.second}
                                </div>
                            )}

                        </div>
                    );
                })}
            </div>
        );
    }

}

export {
    CompareComponent
};
export type {SingleComparison};

