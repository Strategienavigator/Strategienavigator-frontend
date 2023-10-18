import {ExtraWindowComponent} from "../../../../general-components/Tool/ExtraWindowComponent/ExtraWindowComponent";
import {ScaleDescriptionTable} from "../steps/UtilCriterias/ScaleDescriptionTable/ScaleDescriptionTable";

import "./ua-scale-description-shower.scss";
import {UtilityAnalysisValues} from "../UtilityAnalysis";

class UAScaleDescriptionShower extends ExtraWindowComponent<UtilityAnalysisValues, {}> {

    render() {
        let criterias = this.props.data["ua-criterias"];
        let evaluation = this.props.data["ua-evaluation"];

        if (criterias?.criterias && evaluation && evaluation.currentHoveredCriteria !== undefined) {
            let criteria = criterias.criterias[evaluation.currentHoveredCriteria];

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
    UAScaleDescriptionShower
}