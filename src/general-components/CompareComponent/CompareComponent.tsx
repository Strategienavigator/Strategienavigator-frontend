import {Component} from "react";
import {CompareAdapter} from "./Adapter/CompareAdapter";
import {CompareHeader} from "./Header/CompareHeader";

import "./compare-component.scss";


interface CompareComponentProps {
    header: CompareHeader
    showHeader?: boolean
    values: CompareAdapter
}

interface SingleComparison {
    first: string
    second?: string
}

class CompareComponent extends Component<CompareComponentProps, any> {

    render = () => {
        let header = this.props.header;
        let values = this.props.values;
        let field = -1;

        return (
            <div>
                {((this.props.showHeader !== undefined && this.props.showHeader) || (this.props.showHeader === undefined)) && (
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
                                            <input  type={"radio"} name={"field-" + field} />
                                        </div>
                                    );
                                })}
                            </div>
                            <div>
                                {comparison.second}
                            </div>
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

