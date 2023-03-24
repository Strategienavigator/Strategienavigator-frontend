
import {
    StepDataHandler,
    StepDefinition,
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {UpdateImgActionsValuesComponent} from "./UpdateImgActionsValuesComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";


export class ImgFactors implements StepDefinition<PersonaAnalysisValues>, StepDataHandler<PersonaAnalysisValues>  {


 

    form: React.FunctionComponent<StepProp<PersonaAnalysisValues>> | React.ComponentClass<StepProp<PersonaAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<PersonaAnalysisValues>;


    constructor() {
        this.id = "Profibild hochladen";
        this.title = "1. Profibild hochladen";
        this.form = UpdateImgActionsValuesComponent;
        this.dataHandler = this;
       
    }
    private static requireData(data: PersonaAnalysisValues) {
        let d = data["uploadImage_actions"];

        if (d === undefined) {
            d = {
                factors: {
                    name: '',
                    vorname: '',
                    alter: '',
                    profibild: '',
                
                }
            }
        };
        
        return d;
    }

    

    isUnlocked = (data: PersonaAnalysisValues): boolean =>    true;
    


    // 初始化的值
    fillFromPreviousValues = (data: PersonaAnalysisValues) => {
        let analysisValues = data["uploadImage_actions"];
        if (analysisValues === undefined) {
            analysisValues = {
                "factors":{
                    name: "",
                    vorname: "",
                    alter: "",
                    profibild: ""
                }
            }
        }
        data["uploadImage_actions"] = analysisValues
   
       
    };



    deleteData(data: PersonaAnalysisValues): PersonaAnalysisValues {
        
        let d = ImgFactors.requireData(data);
        d.factors.name = ""
        d.factors.vorname = ""
        d.factors.alter = ""
        d.factors.profibild = ""
        data["uploadImage_actions"] = d;
        return data;
    }

    validateData(data: PersonaAnalysisValues): UIError[] {
        const errors = Array<UIError>();
        // const errorText = (text: string) => `Bitte füllen Sie alle ${text} aus!`;
 
        return errors;
    }


}
