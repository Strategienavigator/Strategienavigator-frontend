
import {
    StepDataHandler,
    StepDefinition,

} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {UpdateImgActionsValues , UploadImgInfoValues} from "../../steps/SWOTAlternativeActions/UpdateImgActionsValuesComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {PersonaFactors} from '../PersonaFactors/PersonaFactors'

export class ImgFactors implements StepDefinition<PersonaAnalysisValues>, StepDataHandler<PersonaAnalysisValues>  {


 

    form: React.FunctionComponent<StepProp<PersonaAnalysisValues>> | React.ComponentClass<StepProp<PersonaAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<PersonaAnalysisValues>;


    constructor() {
        this.id = "Profibild hochladen";
        this.title = "1. Profibild hochladen";
        this.form = UpdateImgActionsValues;
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
                    vorname: "1",
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

      
        let d1 = PersonaFactors.requireData(data);
        d1.factors.qualifikation = PersonaFactors.getDefaultArray(PersonaFactors.qualifikationCounter);
        d1.factors.art_der_Erkrankung = PersonaFactors.getDefaultArray(PersonaFactors.art_der_ErkrankungCounter);
        d1.factors.beraterOrAngehörige = PersonaFactors.getDefaultArray(PersonaFactors.beraterOrAngehörigeCounter);
        d1.factors.familieOrFreunde = PersonaFactors.getDefaultArray(PersonaFactors.familieOrFreundeCounter);
        d1.factors.charaktereigenschaften = PersonaFactors.getDefaultArray(PersonaFactors.charaktereigenschaftenCounter);
        d1.factors.bedürfnisse= PersonaFactors.getDefaultArray(PersonaFactors.bedürfnisseCounter);
        d1.factors.hobies = PersonaFactors.getDefaultArray(PersonaFactors.hobiesCounter);
        d1.factors.motivation = PersonaFactors.getDefaultArray(PersonaFactors.motivationCounter);
        d1.factors.zitat = PersonaFactors.getDefaultArray(PersonaFactors.zitatCounter);
        data["persona-factors"] = d1;
        return data;
    }

    validateData(data: PersonaAnalysisValues): UIError[] {
        const errors = Array<UIError>();
        const errorText = (text: string) => `Bitte füllen Sie alle ${text} aus!`;

        return errors;
    }


}

