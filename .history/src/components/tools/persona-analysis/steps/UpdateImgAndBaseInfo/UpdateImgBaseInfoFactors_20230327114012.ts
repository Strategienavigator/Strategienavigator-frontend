
import {
    StepDataHandler,
    StepDefinition,
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {UpdateImgActionsValuesComponent} from "./UpdateImgBaseInfoComponent";
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
                    surname: '',
                    age: '',
                    profibild: '',
                    profibildName: '',
                }
            }
        };
        
        return d;
    }

    
   // Determine whether the previous page is completed, this method is used to mark whether this page is unlocked
    isUnlocked = (data: PersonaAnalysisValues): boolean =>    true;
    
    // Initialized value
    fillFromPreviousValues = (data: PersonaAnalysisValues) => {
        let analysisValues = data["uploadImage_actions"];
        if (analysisValues === undefined) {
            analysisValues = {
                "factors":{
                    name: "",
                    surname: "",
                    age: "",
                    profibild: "",
                    profibildName: ""
                }
            }
        }
        data["uploadImage_actions"] = analysisValues
   
       
    };

    deleteData(data: PersonaAnalysisValues): PersonaAnalysisValues {
        
        let d = ImgFactors.requireData(data);
        d.factors.name = ""
        d.factors.surname = ""
        d.factors.age = ""
        d.factors.profibild = ""
        data["uploadImage_actions"] = d;
        return data;
    }

    validateData(data: PersonaAnalysisValues): UIError[] {
        const errors = Array<UIError>();
        const errorText = (text: string) => `Bitte füllen Sie ${text} aus!`;
        // const errorText = (text: string) => `Bitte füllen Sie alle ${text} aus!`;
        if ((data["uploadImage_actions"]?.factors.name==''||data["uploadImage_actions"]?.factors.name==undefined)) {
            errors.push({
                id: "uploadImage_actions.nameError",
                message: errorText("name"),
                level: "error"
            });}
        if ((data["uploadImage_actions"]?.factors.surname==''||data["uploadImage_actions"]?.factors.surname==undefined)) {
            errors.push({
                id: "uploadImage_actions.surnameError",
                message: errorText("Vorname"),
                level: "error"
            });    
        }
        return errors;
    }


}
