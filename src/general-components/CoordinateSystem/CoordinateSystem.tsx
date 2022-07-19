import {Component} from "react";

import "./coordinate-system.scss";
import {ValueRenderer} from "./ValueRenderer/ValueRenderer";
import {NumberValueRenderer} from "./ValueRenderer/NumberValueRenderer";
import {Property} from "csstype";
import {CustomGrid} from "./Grid/CustomGrid";
import {Point} from "./Point";
import {OverlayTrigger, Tooltip} from "react-bootstrap";


export interface NumberRange {
    start: number,
    end: number
}

interface AxisInterface {
    maxValue: number,
    name?: string,
    valueRenderer?: ValueRenderer,
    valueAccuracy?: number
}

export interface CoordinateSystemGrid {
    thickness?: number,
    style?: Property.BorderStyle,
    color?: Property.BorderColor
}

interface axisValues {
    total: number,
    startShare: number,
    endShare: number
}

export interface CoordinateSystemProps {
    maxWidth?: number,
    axisThickness?: number,
    gridDisplay?: boolean | CoordinateSystemGrid | CustomGrid,
    axis: {
        y: AxisInterface
        x: AxisInterface
    },
    points: Point[],
    widthRange: NumberRange,
    heightRange: NumberRange,
}


class CoordinateSystem extends Component<CoordinateSystemProps, any> {
    static standardValueRenderer = new NumberValueRenderer(0);
    static maxWidth = 700;
    static standardThickness = 1;
    static standardAccuracy = 3;

    static standardPointSize = 3;
    static minPointSize = 1;
    static maxPointSize = 8;

    render() {
        let maxWidth = (this.props.maxWidth) ? this.props.maxWidth : CoordinateSystem.maxWidth;
        let axisThickness = (this.props.axisThickness) ? this.props.axisThickness : CoordinateSystem.standardThickness;

        let yAxisShares = this.getAxisShares(this.props.heightRange);
        let xAxisShares = this.getAxisShares(this.props.widthRange);

        let xAxisValueRenderer = (this.props.axis.x.valueRenderer) ? this.props.axis.x.valueRenderer : CoordinateSystem.standardValueRenderer;
        let yAxisValueRenderer = (this.props.axis.y.valueRenderer) ? this.props.axis.y.valueRenderer : CoordinateSystem.standardValueRenderer;

        let xAxisValues = this.getAxisValues(this.props.widthRange, this.props.axis.x)
        let yAxisValues = this.getAxisValues(this.props.heightRange, this.props.axis.y);

        let xAxisAccuracy = this.getAxisAccuracy(this.props.axis.x);
        let yAxisAccuracy = this.getAxisAccuracy(this.props.axis.y);
        let gridItems = this.getGridItems(xAxisAccuracy * yAxisAccuracy);

        const getGridString = (amount: number): string => {
            return Array(amount).fill("1fr", 0, amount).join(" ");
        }

        return (
            <div className={"coordinate-system-wrapper"} style={{maxWidth: maxWidth}}>
                <div className={"axis-name y"}>
                    {this.props.axis.y.name}
                </div>
                <div className={"coordinate-system-container"}>
                    {(this.props.gridDisplay && typeof this.props.gridDisplay === "object" && this.props.gridDisplay instanceof CustomGrid) ?
                        this.props.gridDisplay.render() : (
                            <div
                                className={"grid-overlay"}
                                style={{
                                    gridTemplateRows: getGridString(yAxisAccuracy),
                                    gridTemplateColumns: getGridString(xAxisAccuracy),
                                }}
                            >
                                {gridItems}
                            </div>
                        )}
                    <div className={"coordinate-system"}>
                        <div className={"points"}>
                            {this.props.points.map((point, index) => {
                                let maxX = this.props.axis.x.maxValue;
                                let maxY = this.props.axis.y.maxValue;

                                if (point.x > maxX || point.y > maxY) {
                                    throw Error("Point outside of Coordinate-System.");
                                }

                                let leftPlacement = (point.x / maxX) * 100;
                                let rightPlacement = 100 - leftPlacement;

                                let bottomPlacement = (point.y / maxY) * 100;
                                let topPlacement = 100 - bottomPlacement;

                                let sizeMultiplier = point.sizeMultiplier;
                                let size = Math.min(Math.max(CoordinateSystem.minPointSize, CoordinateSystem.standardPointSize * sizeMultiplier), CoordinateSystem.maxPointSize);

                                return (
                                    <div
                                        key={"POINT-" + point.x + "-" + point.y + "-" + index}
                                        className={"point"}
                                        data-x={point.x}
                                        data-y={point.y}
                                        style={{
                                            top: String(topPlacement) + "%",
                                            left: String(leftPlacement) + "%",
                                            bottom: String(bottomPlacement) + "%",
                                            right: String(rightPlacement) + "%",
                                            width: String(size) + "%",
                                            height: String(size) + "%"
                                        }}
                                    >
                                        <OverlayTrigger
                                            trigger={["hover", "focus"]}
                                            placement="top"
                                            overlay={(
                                                <Tooltip
                                                    style={{textAlign: "left"}}
                                                >
                                                    <strong>{point.header}</strong><br/>

                                                    Marktattraktivität: {point.y} <br/>
                                                    Marktanteil: {point.x}
                                                </Tooltip>
                                            )}
                                        >
                                            <div className={"circle"}/>
                                        </OverlayTrigger>
                                    </div>
                                );
                            })}
                        </div>

                        <div className={"axis-container"}>
                            <div className={"axis y"} style={{
                                left: String(xAxisShares.startShare) + "%",
                                right: String(xAxisShares.endShare) + "%"
                            }}>
                                <div className={"values"}>
                                    {(yAxisValues.map((value) => {
                                        return (
                                            <div key={"Y-Value-" + value}>
                                                {yAxisValueRenderer.render(value)}
                                            </div>
                                        );
                                    }))}
                                </div>
                                <div className={"line"}
                                     style={{
                                         minWidth: axisThickness
                                     }}
                                />
                            </div>

                            <div className={"axis x"} style={{
                                top: String(yAxisShares.endShare) + "%",
                                bottom: String(yAxisShares.startShare) + "%"
                            }}>
                                <div className={"line"}
                                     style={{
                                         minHeight: axisThickness
                                     }}
                                />
                                <div className={"values"}>
                                    {(xAxisValues.map((value) => {
                                        return (
                                            <div key={"X-Value-" + value}>
                                                {xAxisValueRenderer.render(value)}
                                            </div>
                                        );
                                    }))}
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
                <div/>
                <div className={"axis-name x"}>
                    {this.props.axis.x.name}
                </div>
            </div>
        );
    }

    private getGridItems = (amount: number) => {
        let gridItems = [];
        let grid = this.props.gridDisplay;

        for (let i = 0; i < amount; i++) {
            let item = <div key={"item-" + i}/>;

            if (typeof grid === "object" && !(grid instanceof CustomGrid)) {
                let borderStyle = (grid.style) ? grid.style : "solid";
                let thickness = (grid.thickness) ? grid.thickness : 1
                let color = (grid.color) ? grid.color : "#d3d3d3";

                item = (
                    <div
                        key={"item-" + i}
                        style={{
                            borderStyle: borderStyle,
                            borderWidth: thickness,
                            borderColor: color
                        }}
                    />
                );
            }

            gridItems.push(item);
        }
        return gridItems;
    }

    private getAxisShares = (range: NumberRange): axisValues => {
        let total = Math.abs(range.start - range.end);

        return {
            total: total,
            startShare: (Math.abs(range.start) / total) * 100,
            endShare: (Math.abs(range.end) / total) * 100
        }
    }

    private getAxisAccuracy = (axis: AxisInterface): number => {
        return (axis.valueAccuracy) ? axis.valueAccuracy : CoordinateSystem.standardAccuracy;
    }

    private getAxisValues = (range: NumberRange, axis: AxisInterface): number[] => {
        let accuracy = this.getAxisAccuracy(axis);
        let values: number[] = [];

        for (let i = 1; i < (accuracy + 1); i++) {
            values.push(i * (axis.maxValue / accuracy));
        }

        return values;
    }

}

export {
    CoordinateSystem
}
