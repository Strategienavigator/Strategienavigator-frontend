import {Component} from "react";
import {Table} from "react-bootstrap";
import {EvaluationValues} from "./Evaluation";


export interface EvaluationComponentProps {
    values: EvaluationValues,
    customTableHeader?: string
}

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
                                    {v.field.name}<br/>
                                    <small>{v.field.desc}</small>
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