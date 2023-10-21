import React from "react";
import {Point} from "./Point/Point";

export function DefaultCoordinateTooltipRenderer(point: Point) {
    return (
        <>
            <strong>{point.header}</strong><br/>
        </>
    );
}