import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CardComponentField} from "../../../../../general-components/CardComponent/CardComponent";
import {Table} from "react-bootstrap";
import {PairwiseComparisonValues} from "../../PairwiseComparison";


interface PointCriteria {
    criteria: CardComponentField
    points: number,
    rank: number
}

export interface PCResultValues {
    result: PointCriteria[]
    resultAsString: string
}


class PCResultComponent extends Step<PairwiseComparisonValues, {}> {


    public constructor(props: Readonly<StepProp<PairwiseComparisonValues>> | StepProp<PairwiseComparisonValues>, context: any) {
        super(props, context);
    }

    build(): JSX.Element {
        let values = this.props.save.data["pc-result"];

        if (values !== undefined) {
            return (
                <div>
                    <div style={{marginBottom: "1.5rem"}}>
                        <b>Ergebnis:</b><br/>
                        {values.resultAsString}
                    </div>

                    <Table className={"resultTable"} bordered={false} borderless={false} hover={true} variant={"light"}
                           striped={true}>
                        <thead>
                        <tr>
                            <th>Kriterium</th>
                            <th className={"fixed"}>Punkte</th>
                            <th className={"fixed"}>Rang</th>
                        </tr>
                        </thead>
                        <tbody>
                        {values.result && values.result.map((v) => {
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

        return <p>ERROR</p>;

    }
}

export {
    PCResultComponent
}

export type {
    PointCriteria
}
