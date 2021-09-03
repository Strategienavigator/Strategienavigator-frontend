import {ToolFrontpage} from "../../../general-components/Tool/Frontpage/ToolFrontpage";
import React from "react";


class ABCAnalysisHome extends ToolFrontpage<any> {

    render = () => {
        return (
            <ToolFrontpage
                tool={4}
                link={"/abc-analysis"}
                maintenance
            >
                <h4>ABC Analyse</h4>

                <hr/>
            </ToolFrontpage>
        )
    }

}

export {
    ABCAnalysisHome
}