import {Component} from "react";
import {Table} from "react-bootstrap";
import {EvaluationValues} from "./Evaluation";


export interface EvaluationComponentProps {
    /**
     * Die Werte der Evaluation
     */
    values: EvaluationValues,
    /**
     * Kann angegeben werden, wenn "Feld" durch etwas anderes ersetzt werden soll
     */
    customTableHeader?: string
}

/**
 * Nutzt die Werte der Evaluation um eine Tabelle auszugeben welches die Ergebnisse anzeigt.
 */
class EvaluationComponent extends Component<EvaluationComponentProps, any> {

    render = () => {
        return (
            <div>
                <div style={{marginBottom: "1.5rem"}}>
                    <b>Ergebnis:</b><br/>
                    {this.props.values.resultAsString}
                </div>

                <Table className={"resultTable"} bordered={false} borderless={false} hover={true} variant={"light"}
                       striped={true}>
                    <thead>
                    <tr>
                        <th>{this.props.customTableHeader ? this.props.customTableHeader : "Feld"}</th>
                        <th className={"fixed"}>Punkte</th>
                        <th className={"fixed"}>Rang</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.values.result && this.props.values.result.map((v) => {
                        return (
                            <tr>
                                <td>
                                    {v.criteria.name}<br/>
                                    <small>{v.criteria.desc}</small>
                                </td>
                                <td className={"fixed"}>{v.points}</td>
                                <td className={"fixed"}>{v.rank}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </div>
        );
    }

}

export {
    EvaluationComponent
}