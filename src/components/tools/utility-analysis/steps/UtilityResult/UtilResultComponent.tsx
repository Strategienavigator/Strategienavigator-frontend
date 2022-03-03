import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {CardComponentField} from "../../../../../general-components/CardComponent/CardComponent";
import {Table} from "react-bootstrap";


export interface UtilResultValues {
    percentages: {
        criteria: CardComponentField,
        points: number,
        percentage: number
    }[],
    result: {
        object: CardComponentField,
        points: number,
        rank: number
    }[]
}

class UtilResultComponent extends Step<UtilityAnalysisValues, any> {

    constructor(props: StepProp<UtilityAnalysisValues>) {
        super(props);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<UtilityAnalysisValues>>, nextState: Readonly<any>, nextContext: any): boolean {
        return !shallowCompareStepProps(this.props, nextProps,
            (oldData, newData) => (
                oldData["ua-result"] === newData["ua-result"]
            )
        );
    }

    build(): JSX.Element {
        let data = this.props.save.data["ua-result"];

        if (data) {
            return (
                <Table bordered={false} borderless={false} hover={true} variant={"light"}
                       striped={true}>
                    <thead>
                    <tr>
                        <th className={"fixed"}>Objekt</th>
                        <th className={"fixed"}>Rang</th>
                    </tr>
                    </thead>
                    <tbody>
                    {data.result && data.result.map((v) => {
                        return (
                            <tr>
                                <td>
                                    {v.object.name}<br/>
                                    <small>{v.object.desc}</small>
                                </td>
                                <td className={"fixed"}>{v.rank}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            );
        }
        return <div>ERROR</div>;
    }

}

export {
    UtilResultComponent
};
