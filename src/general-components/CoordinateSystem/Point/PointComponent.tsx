import {Component, CSSProperties} from "react";
import {Point} from "./Point";
import {Table} from "react-bootstrap";


export interface PointComponentProps {
    points: Point[],
    customHeader?: string,
    axisHeader?: {
        x?: string,
        y?: string
    }
    displayColor?: boolean
}

class PointComponent extends Component<PointComponentProps, any> {

    render() {
        return (
            <Table
                bordered={false} borderless={false} hover={true} variant={"light"}
                striped={true}
            >
                <thead>
                <tr>
                    <th>{(this.props.customHeader) ?? "Punkt"}</th>
                    <th>{(this.props.axisHeader && this.props.axisHeader.x) ?? "X-Wert"}</th>
                    <th>{(this.props.axisHeader && this.props.axisHeader.y) ?? "Y-Wert"}</th>
                </tr>
                </thead>
                <tbody>
                {this.props.points.map((point, index) => {
                    let style: CSSProperties = {borderLeft: "4px solid black"};
                    return (
                        <tr
                            key={"point-" + index + "-" + point.x + "-" + point.y}
                            style={Object.assign(style, (this.props.displayColor) ? {borderLeftColor: point.color} : {})}
                        >
                            <td>{point.header}</td>
                            <td>{point.x.toFixed(2)}</td>
                            <td>{point.y.toFixed(2)}</td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
        );
    }

}

export {
    PointComponent
}