import {ExtraWindowComponent} from "../../../../general-components/Tool/ExtraWindowComponent/ExtraWindowComponent";
import {PersonaAnalysisValues} from "../PersonaAnalysis";
import "./persona-info-shower.scss";
import {Image} from "react-bootstrap";

class PersonaAnalysisInfoShower extends ExtraWindowComponent<PersonaAnalysisValues, {}> {

    render() {
        let data = this.getData()["persona-info"];

        if (data) {
            return (
                <div className={"persona-info-shower"}>
                    <div className={"name"}>{data.firstname}</div>
                    <div className={"image-container"}>
                        <Image src={this.props.resourceManager.getBlobURL("avatar") ?? undefined} thumbnail
                               className={"image"} alt={"Avatar vom Persona"}/>
                    </div>
                    <div className={"info"}>
                        <div className={"age"}>
                            {data.age} {((data.age ?? -1) === 1) ? "Jahr" : "Jahre"} alt
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
