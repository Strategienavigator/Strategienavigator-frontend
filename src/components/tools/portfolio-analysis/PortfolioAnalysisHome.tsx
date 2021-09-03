import {ToolFrontpage} from "../../../general-components/Tool/Frontpage/ToolFrontpage";
import React from "react";


class PortfolioAnalysisHome extends ToolFrontpage<any> {

    render = () => {
        return (
            <ToolFrontpage
                tool={4}
                link={"/portfolio-analysis"}
                maintenance
            >
                <h4>Portfolio Analyse</h4>

                <hr/>
            </ToolFrontpage>
        )
    }

}

export {
    PortfolioAnalysisHome
}