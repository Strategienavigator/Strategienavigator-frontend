import {Component, ReactElement} from "react";

import "./coordinate-system.scss";
import {ValueRenderer} from "./ValueRenderer/ValueRenderer";
import {NumberValueRenderer} from "./ValueRenderer/NumberValueRenderer";
import {Property} from "csstype";
import {CustomGrid} from "./Grid/CustomGrid";
import {Point} from "./Point/Point";
import {Col, OverlayTrigger, Row, Tooltip} from "react-bootstrap";
import {getMixOfColors} from "../Color";


/**
 * Wird benutzt beim Festlegen der Achsenverhältnisse
 */
export interface NumberRange {
    /**
     * Wertstart der Range
     */
    start: number,
    /**
     * Wertende der Range
     */
    end: number
}

/**
 * Angabe der Achsenwerte
 */
interface AxisInterface {
    /**
     * Maximalwert der Achse, Auto sorgt für eigene Maximalwerte
     */
    maxValue?: number | "auto",
    /**
     * Gibt an wie viel datenwerte an den Achsen geschrieben werden sollen. Die Werte werden mit Hilfe der maxValue automatisch aufgeteilt.
     * Ist Standardmäßig auf auto
     */
    valueAccuracy?: number | "auto"
    /**
     * Name der Achse
     */
    name?: string,
    /**
     * Kann angegeben werden um die Datenwerte der Achse verschiedenst zu rendern
     */
    valueRenderer?: ValueRenderer,
}

/**
 * Grid des Koordinatensystems.
 * Das Grid richtet sich automatisch nach den valueAccuracys der Achsen.
 */
export interface CoordinateSystemGrid {
    /**
     * Dicke der Grid-Border
     */
    thickness?: number,
    /**
     * CSS-Border-Style
     */
    style?: Property.BorderStyle,
    /**
     * CSS-Border-Color
     */
    color?: Property.BorderColor
}

/**
 * Enthält die Achsenverhältnisse. Wird mittels Numberrange ausgerechnet.
 */
interface axisValues {
    /**
     * Anzahl des gesamtverhältnisses
     */
    total: number,
    /**
     * Prozentzahl des Startwertes
     */
    startShare: number,
    /**
     * Prozentzahl des Endwertes
     */
    endShare: number
}

interface PointGroup {
    name: string,
    points: Point[],
    middlePoint: Point
}

type PointGroups = PointGroup[]

/**
 * Props des Koordinatensystems
 */
export interface CoordinateSystemProps {
    /**
     * Maximalbreite des Koordinatensystems (Quadratisch)
     */
    maxWidth?: number,
    /**
     * Die Dicke der Achsen (1-n)
     */
    axisThickness?: number,
    /**
     * Das Grid welches im Koordinatensystems gezeichnet wird.
     * Wird true angegeben, wird ein Standardgrid benutzt.
     * Es kann auch ein CustomGrid angegeben werden (bsp. BCG-Grid)
     * Das Grid kann auch mittels CoordinateSystemGrid angepasst werden.
     */
    gridDisplay?: boolean | CoordinateSystemGrid | CustomGrid,
    /**
     * Rendert den Inhalt des Tooltips.
     * Der Tooltip wird über einem spezifischen Punkt angezeigt.
     *
     * @param {Point} point Der Punkt der im Tooltip angezeigt wird
     * @returns {React.ReactElement} Der Inhalt
     */
    tooltipContentRenderer?: (point: Point) => ReactElement,
    /**
     * Gibt an ob eine Legende gerendert werden soll.
     * Die Legende wird automatisch mit Hilfe der angegeben Punkte gerendert.
     */
    legend?: boolean,
    /**
     * Information zu den Achsen
     */
    axis: {
        y: AxisInterface
        x: AxisInterface
    },
    /**
     * Die Punkte welche im Koordinatensystem gerendert werden sollen
     */
    points: Point[],
    /**
     * Achsenverhältnisse der X-Achse.
     * (-10, 10) würde für ein Verhältnis von 50% zu 50% sorgen. So wäre die Y-Achse in der Mitte
     */
    widthRange: NumberRange,
    /**
     * Achsenverhältnisse der Y-Achse.
     */
    heightRange: NumberRange,
}

interface CoordinateSystemState {
    maxY: number,
    maxX: number,
    valueAccuracyY: number,
    valueAccuracyX: number
}

/**
 * Dient zum darstellen eines Koordinatensystem
 */
class CoordinateSystem extends Component<CoordinateSystemProps, CoordinateSystemState> {
    // Standardwerte
    static standardValueRenderer = new NumberValueRenderer(0);
    static maxWidth = 700;
    static standardThickness = 1;
    static pointGroupDeviation = 0.09;

    // Standardwerte der Größen
    static standardPointSize = 4;
    static minPointSize = 3;
    static maxPointSize = 12;

    state = {
        maxY: 6,
        maxX: 6,
        valueAccuracyY: 6,
        valueAccuracyX: 6
    }

    static getDerivedStateFromProps(props: CoordinateSystemProps, state: CoordinateSystemState): CoordinateSystemState {
        let maxY, maxX;
        if (props.axis.y.maxValue === undefined || props.axis.y.maxValue === "auto") {
            maxY = Math.round(Math.max(...props.points.map(p => p.y))) + 1;
        } else {
            maxY = props.axis.y.maxValue;
        }

        if (props.axis.x.maxValue === undefined || props.axis.x.maxValue === "auto") {
            maxX = Math.round(Math.max(...props.points.map(p => p.x))) + 1;
        } else {
            maxX = props.axis.x.maxValue;
        }

        return {
            maxY: maxY,
            maxX: maxX,
            valueAccuracyY: maxY,
            valueAccuracyX: maxX
        }
    }

    private static isInRange(value: number, range: NumberRange): boolean {
        return value <= range.end && value >= range.start;
    }

    render() {
        let maxWidth = (this.props.maxWidth) ?? CoordinateSystem.maxWidth;
        let axisThickness = (this.props.axisThickness) ?? CoordinateSystem.standardThickness;

        let yAxisShares = this.getAxisShares(this.props.heightRange);
        let xAxisShares = this.getAxisShares(this.props.widthRange);

        let xAxisValueRenderer = (this.props.axis.x.valueRenderer) ?? CoordinateSystem.standardValueRenderer;
        let yAxisValueRenderer = (this.props.axis.y.valueRenderer) ?? CoordinateSystem.standardValueRenderer;

        let xAxisValues = this.getAxisValues(this.props.widthRange, this.props.axis.x, "x");
        let yAxisValues = this.getAxisValues(this.props.heightRange, this.props.axis.y, "y");

        let gridItems = this.getGridItems(this.state.valueAccuracyX * this.state.valueAccuracyY);

        let pointGroups = this.getPointGroups();

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
                                    gridTemplateRows: this.getGridString(this.state.valueAccuracyY),
                                    gridTemplateColumns: this.getGridString(this.state.valueAccuracyX),
                                }}
                            >
                                {gridItems}
                            </div>
                        )}
                    <div className={"coordinate-system"}>
                        <div className={"points"}>
                            {pointGroups.map((pointGroup, index) => {
                                let point = pointGroup.middlePoint;

                                if (point.x > this.state.maxX || point.y > this.state.maxY) {
                                    throw Error(`Point ${point.toString()} outside of Coordinate-System.`);
                                }

                                let leftPlacement = (point.x / this.state.maxX) * 100;
                                let rightPlacement = 100 - leftPlacement;

                                let bottomPlacement = (point.y / this.state.maxY) * 100;
                                let topPlacement = 100 - bottomPlacement;

                                let sizeMultiplier = point.sizeMultiplier;
                                let size = Math.min(
                                    Math.max(
                                        CoordinateSystem.minPointSize,
                                        CoordinateSystem.standardPointSize * sizeMultiplier
                                    ),
                                    CoordinateSystem.maxPointSize
                                );

                                return (
                                    <div
                                        key={`POINT-GROUP-${index}`}
                                        className={"point group"}
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
                                            placement={"top"}
                                            overlay={(this.props.tooltipContentRenderer) ? (
                                                <Tooltip>
                                                    <div
                                                        className={`group ${pointGroup.name}`}
                                                        data-group={pointGroup.name}
                                                    >
                                                        {pointGroup.points.map((point, groupIndex) => {
                                                            return (
                                                                <div key={`tooltip-point-${index}-${groupIndex}`}
                                                                     className={`point`} data-point={point.header}>
                                                                    {this.props.tooltipContentRenderer?.call(this.props.tooltipContentRenderer, point)}
                                                                </div>
                                                            );
                                                        })}
                                                    </div>
                                                </Tooltip>
                                            ) : <></>}
                                        >
                                            <div
                                                className={"circle"}
                                                style={{
                                                    backgroundColor: point.color
                                                }}
                                            >
                                                {pointGroup.points.length > 1 && (
                                                    <span className={"pointgroup-length"}>
                                                        {pointGroup.points.length}
                                                    </span>
                                                )}
                                            </div>
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
                <div/>
                <div className={"legend"}>
                    {(this.props.legend) && (
                        <Row className={"points"}>
                            {this.props.points.map((point, index) => {
                                return (
                                    <Col key={"legend-point-" + point.header + "-" + index}>
                                        <div
                                            className={"point"}
                                            style={{
                                                borderLeftColor: point.color
                                            }}
                                        >
                                            {point.header}
                                        </div>
                                    </Col>
                                );
                            })}
                        </Row>
                    )}
                </div>
            </div>
        );
    }

    private getPointGroups(): PointGroups {
        let groups: PointGroups = [];
        let remainingPoints = this.props.points;

        const removePoint = (point: Point) => {
            remainingPoints = remainingPoints.filter((p) => {
                return point !== p;
            });
        }

        let g = 1;
        while (remainingPoints.length > 0) {
            let point = remainingPoints[0];
            let currentGroup: PointGroup = {
                name: "group-" + g,
                points: [],
                middlePoint: new Point(0, 0, "", 0)
            };
            currentGroup.points.push(point);
            removePoint(point);

            for (const checkPoint of remainingPoints) {
                let xRange: NumberRange = {
                    start: checkPoint.x * (1 - CoordinateSystem.pointGroupDeviation),
                    end: checkPoint.x * (1 + CoordinateSystem.pointGroupDeviation)
                };
                let yRange: NumberRange = {
                    start: checkPoint.y * (1 - CoordinateSystem.pointGroupDeviation),
                    end: checkPoint.y * (1 + CoordinateSystem.pointGroupDeviation)
                };

                if (
                    CoordinateSystem.isInRange(point.x, xRange)
                    && CoordinateSystem.isInRange(point.y, yRange)
                ) {
                    currentGroup.points.push(checkPoint);
                    removePoint(checkPoint);
                }
            }

            // build middlepoint
            let xValues: number[] = currentGroup.points.map((p) => p.x);
            let yValues: number[] = currentGroup.points.map((p) => p.y);
            let xAvg = xValues.reduce((a, b) => a + b, 0) / xValues.length;
            let yAvg = yValues.reduce((a, b) => a + b, 0) / xValues.length;

            let sm = currentGroup.points.map(p => p.sizeMultiplier).reduce((a, b) => a + b, 0) / currentGroup.points.length;
            let color = getMixOfColors(currentGroup.points.map(p => p.color));

            currentGroup.middlePoint = new Point(xAvg, yAvg, "Mittelpunkt-" + g, sm, color);

            groups.push(currentGroup);
            g++;
        }
        return groups;
    }

    /**
     * Gibt einen String zurück welcher die Grid-Items enthält.
     *
     * @param {number} amount Anzahl der FRs
     * @returns {string} z.B. "1fr 1fr 1fr 1fr"
     */
    private getGridString = (amount: number): string => {
        return Array(amount).fill("1fr", 0, amount).join(" ");
    }

    private getGridItems = (amount: number) => {
        let gridItems = [];
        let grid = this.props.gridDisplay;

        for (let i = 0; i < amount; i++) {
            let item = <div key={"grid-item-" + i}/>;

            if (typeof grid === "object" && !(grid instanceof CustomGrid)) {
                let borderStyle = (grid.style) ? grid.style : "solid";
                let thickness = (grid.thickness) ? grid.thickness : 1
                let color = (grid.color) ? grid.color : "#d3d3d3";

                item = (
                    <div
                        key={"custom-grid-item-" + i}
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

    private getAxisValues = (range: NumberRange, axis: AxisInterface, axisIdentifier: "x" | "y"): number[] => {
        let accuracy = (axisIdentifier === "y") ? this.state.valueAccuracyY : this.state.valueAccuracyX;
        let values: number[] = [];

        for (let i = 1; i < (accuracy + 1); i++) {
            values.push(i * (((axisIdentifier === "y") ? this.state.maxY : this.state.maxX) / accuracy));
        }

        return values;
    }

}

export {
    CoordinateSystem
}
