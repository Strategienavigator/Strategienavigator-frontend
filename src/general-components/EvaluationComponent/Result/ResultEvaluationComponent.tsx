import {Component} from "react";
import {Table} from "react-bootstrap";
import {ResultEvaluationResult, ResultEvaluationValue} from "./ResultEvaluation";
import {WeightingEvaluation} from "../Weighting/WeightingEvaluation";


interface ResultEvaluationComponentProps {
    values: ResultEvaluationValue
}

class ResultEvaluationComponent extends Component<ResultEvaluationComponentProps, any> {

    render() {
        let result = this.props.values.result;

        let target: ResultEvaluationResult[] = [];
        let sortedResult = Object.assign(target, result);
        if (sortedResult) {
            sortedResult = WeightingEvaluation.sort(sortedResult);
        }

        return (
            <Table size={"sm"} bordered={false} borderless={false} hover={true} variant={"light"}
                   striped={true}>
                <thead>
                <tr>
                    <th className={"fixed"}>Objekt</th>
                    <th className={"fixed"}>Punkte</th>
                    <th className={"fixed"}>Rang</th>
                </tr>
                </thead>
                <tbody>
                {sortedResult && sortedResult.map((v, index) => {
                    return (
                        <tr key={"utility-analysis-evaluation-" + v.object.id + "-" + index}>
                            <td>
                                {v.object.name}<br/>
                                <small>{v.object.desc}</small>
                            </td>
                            <td>{v.points.toFixed(2)}</td>
                            <td className={"fixed"}>{v.rank}</td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
        );
    }

}

export {
    ResultEvaluationComponent
}