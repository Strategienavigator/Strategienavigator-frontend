
import {ExtraWindowComponent} from "../../../../general-components/Tool/ExtraWindowComponent/ExtraWindowComponent";
import {
    ScaleDescriptionTable
} from "../../utility-analysis/steps/UtilCriterias/ScaleDescriptionTable/ScaleDescriptionTable";
import {PortfolioAnalysisValues} from "../PortfolioAnalysis";

import "./port-scale-description-shower.scss";

class PortScaleDescriptionShower extends ExtraWindowComponent<PortfolioAnalysisValues, {}> {

    render() {
        let criterias = this.props.data["port-criterias"];
        let evaluation = this.props.data["port-evaluation"];

        if (criterias && evaluation && evaluation.currentHoveredCriteria !== undefined) {
            let allCriterias = criterias["attractivity"].concat(criterias["comp-standing"]);
            let criteria = allCriterias[evaluation.currentHoveredCriteria];

            if (
                criteria &&
                criteria.extra
            ) {
                return (
                    <div className={"scale-description-matrix"}>
                        <h5 className={"scale-header"}>{criteria.name}</h5>

                        <ScaleDescriptionTable
                            activeIndices={criteria.extra.activeIndices}
                            headers={criteria.extra.headers}
                        />
                    </div>
                );
            }
        }
        return null;
    }

}

export {
    PortScaleDescriptionShower
}