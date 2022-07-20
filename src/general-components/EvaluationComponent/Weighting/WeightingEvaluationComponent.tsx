import {Component} from "react";
import {Table} from "react-bootstrap";
import {EvaluationValues, SingleResult} from "./WeightingEvaluation";


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
class WeightingEvaluationComponent extends Component<EvaluationComponentProps, any> {

    render = () => {
        let sum = this.props.values.result.reduce((p, n) => p + n.points, 0);
        let result = this.props.values.result;

        let target: SingleResult[] = [];
        let sortedResult = Object.assign(target, result);
        if (sortedResult) {
            sortedResult = sortedResult.sort((a, b) => {
                if (a.points > b.points) {
                    return -1;
                }
                if (a.points < b.points) {
                    return 1;
                }
                return 0;
            })
        }

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
                        <th className={"fixed"}>Gewichtung</th>
                        <th className={"fixed"}>Punkte</th>
                        <th className={"fixed"}>Rang</th>
                    </tr>
                    </thead>
                    <tbody>
                    {sortedResult && sortedResult.map((v, index) => {
                        return (
                            <tr key={"criteria-evaluation-" + v.criteria.id + "-" + index}>
                                <td>
                                    {v.criteria.name}<br/>
                                    <small>{v.criteria.desc}</small>
                                </td>
                                <td>{(Math.round(((v.points / sum) * 100) * 100) / 100)} %</td>
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
    WeightingEvaluationComponent
}