import {
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";


export interface PersonaShowValues {

}
export class PersonaShowComponent extends Step<PersonaAnalysisValues, PersonaShowValues>{

    tempStr:string;

    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
        this.tempStr = JSON.stringify(props.save)
    }

    build(): JSX.Element {
        return <div>
                全属性：{this.tempStr}
                <br/>
                某一属性： 第一个页面的name:【 {this.props.save.data['uploadImage_actions']?.factors.name}】
            </div>
    }
}