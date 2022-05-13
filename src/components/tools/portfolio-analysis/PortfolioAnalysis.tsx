import {faArrowsAlt} from "@fortawesome/free-solid-svg-icons";

import "./portfolio-analysis.scss";
import {SteppableTool} from "../../../general-components/Tool/SteppableTool/SteppableTool";
import {RouteComponentProps} from "react-router";


class PortfolioAnalysis extends SteppableTool<any> {


    constructor(props: RouteComponentProps, context: any) {
        super(props, context, "Portfolio Analyse", faArrowsAlt, 5);


        this.setMaintenance(true);

        /*this.addStep({
            id: "portfolio-objects",
            title: "1. Objekte anlegen",
            form: <PortCreateObjects/>
        });
        this.addStep({
            id: "portfolio-criterias",
            title: "2. Kriterien",
            form: <PortCriterias/>
        });
        this.addStep({
            id: "portfolio-weighting",
            title: "3. Gewichtung",
            form: <PortWeighting/>
        });
        this.addStep({
            id: "portfolio-evaluation",
            title: "4. Bewertung",
            form: <PortEvaluation/>
        });
        this.addStep({
            id: "portfolio-result",
            title: "5. Ergebnismatrix",
            form: <PortResult/>
        });*/
    }

    protected renderToolHome() {
        return null;
    }

    protected renderShortDescription() {
        return null;
    }

    protected renderTutorial() {
        return null;
    }

    protected getInitData(): any {
    }

}

export {
    PortfolioAnalysis
}
