import React, {Component, ReactNode} from "react";

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
export class ButtonPanel extends Component<ButtonPanelProps, any> {

    render() {
        let classes = ["button-panel"];

        return (
            <div
                className={classes.join(" ")}
                style={{
                    justifyContent: (this.props.flexHAlign) ?? "initial",
                    alignItems: (this.props.flexVAlign) ?? "initial"
                }}
            >
                {React.Children.toArray(this.props.children).map((element, index) => {
                    let shouldBreak = (
                        this.props.buttonPerCol &&
                        index > 0 &&
                        index < React.Children.count(this.props.children) &&
                        (index % this.props.buttonPerCol === 0)
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

}
