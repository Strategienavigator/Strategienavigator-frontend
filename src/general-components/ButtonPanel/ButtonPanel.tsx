import React, {ReactNode} from "react";

import "./button-panel.scss";
import {Property} from "csstype";


export interface ButtonPanelProps {
    buttonPerCol?: number,
    auto?: boolean,
    flexHAlign?: Property.JustifyContent,
    flexVAlign?: Property.AlignItems,
    children: ReactNode
}

/**
 * Zeigt alle Schaltflächen in einem Panel an, das sie nebeneinander anzeigt und auch reaktionsschnell umbricht
 */
export function ButtonPanel({flexHAlign, flexVAlign, children, auto, buttonPerCol}: ButtonPanelProps) {
    let classes = ["button-panel"];

    return (
        <div
            className={classes.join(" ")}
            style={{
                justifyContent: (flexHAlign) ?? "initial",
                alignItems: (flexVAlign) ?? "initial"
            }}
        >
            {React.Children.toArray(children).map((element, index) => {
                let shouldBreak = (
                    buttonPerCol &&
                    index > 0 &&
                    index < React.Children.count(children) &&
                    (index % buttonPerCol === 0)
                );

                return (
                    <React.Fragment key={"bp-" + index + "-" + element}>
                        {shouldBreak && (
                            <div className={"break"}/>
                        )}
                        <div className={"item"}>
                            {element}
                        </div>
                    </React.Fragment>
                );
            })}
        </div>
    );
}
