import {ToolFrontpage} from "../../../general-components/Tool/Frontpage/ToolFrontpage";
import React from "react";


class UtilityAnalysisHome extends ToolFrontpage<any> {

    render = () => {
        return (
            <ToolFrontpage
                tool={1}
                link={"/utility-analysis"}
                maintenance
            >
                <h4>Nutzwertanalyse</h4>

                <hr/>
            </ToolFrontpage>
        )
    }

}

export {
    UtilityAnalysisHome
}