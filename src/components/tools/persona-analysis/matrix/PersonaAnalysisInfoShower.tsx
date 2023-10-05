import {ExtraWindowComponent} from "../../../../general-components/Tool/ExtraWindowComponent/ExtraWindowComponent";
import {PersonaAnalysisValues} from "../PersonaAnalysis";
import "./persona-info-shower.scss";
import {Image} from "react-bootstrap";
import {getFamilyStatus} from "../steps/PersonaInfo/PersonaInfoComponent";

class PersonaAnalysisInfoShower extends ExtraWindowComponent<PersonaAnalysisValues, {}> {

    render() {
        let data = this.getData()["persona-info"];

        if (data) {
            return (
                <div className={"persona-info-shower"}>
                    <div className={"name"}>{data.firstname} {data.lastname}</div>
                    <div className={"image-container"}>
                        <Image src={this.props.resourceManager.getBlobURL("avatar") ?? undefined} thumbnail
                               className={"image"} alt={"Avatar vom Persona"}/>
                    </div>
                    <div className={"info"}>
                        <div className={"age"}>
                            {data.age} {((data.age ?? -1) === 1) ? "Jahr" : "Jahre"} alt
                            {(data.familystatus !== 0) && (
                                <>
                                    <br/>
                                    Familienstand: {getFamilyStatus(data.familystatus)}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            );
        }
        return null;
    }

}

export {
    PersonaAnalysisInfoShower
}
