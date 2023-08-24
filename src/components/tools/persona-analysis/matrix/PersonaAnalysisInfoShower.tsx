import {ExtraWindowComponent} from "../../../../general-components/Tool/ExtraWindowComponent/ExtraWindowComponent";
import {PersonaAnalysisValues} from "../PersonaAnalysis";
import "./persona-info-shower.scss";

class PersonaAnalysisInfoShower extends ExtraWindowComponent<PersonaAnalysisValues, {}> {

    render() {
        let data = this.getData()["persona-info"];

        if (data) {
            return (
                <div className={"persona-info-shower"}>
                    <div>{data.firstname} {data.lastname}</div>
                    <div className={"image-container"}>
                        <img src={data.avatar ?? ""} className={"image"} alt={"Avatar vom Persona"} />
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
