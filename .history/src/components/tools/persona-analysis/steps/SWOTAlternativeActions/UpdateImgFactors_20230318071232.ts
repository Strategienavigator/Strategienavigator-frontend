
import {
    StepDataHandler,
    StepDefinition,
    SubStepDefinition,
    CustomNextButton
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {UpdateImgActionsValues , UploadImgInfoValues} from "../../steps/SWOTAlternativeActions/UpdateImgActionsValuesComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {
    CardComponentField,
    isCardComponentFilled,
    isCardComponentTooLong,
} from "../../../../../general-components/CardComponent/CardComponent";
import {CounterInterface} from "../../../../../general-components/Counter/CounterInterface";
import {UpperABCCounter} from "../../../../../general-components/Counter/UpperABCCounter";
import {LowerABCCounter} from "../../../../../general-components/Counter/LowerABCCounter";
import {NumberCounter} from "../../../../../general-components/Counter/NumberCounter";
import {RomanNumeralsCounter} from "../../../../../general-components/Counter/RomanNumeralsCounter";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";


export class ImgFactors implements StepDefinition<PersonaAnalysisValues>, StepDataHandler<PersonaAnalysisValues>  {


 

    form: React.FunctionComponent<StepProp<PersonaAnalysisValues>> | React.ComponentClass<StepProp<PersonaAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<PersonaAnalysisValues>;


    constructor() {
        this.id = "Profibild hochladen";
        this.title = "2. Profibild hochladen";
        this.form = UpdateImgActionsValues;
        this.dataHandler = this;
       
    }
    private static requireData(data: PersonaAnalysisValues) {
        let d = data["uploadImage_actions"];

        if (d === undefined) {
            d = {
                factors: {
                    name: '1',
                    vorname: '',
                    alter: '',
                    profibild: '',
                
                }
            }
        };
        
        return d;
    }

    

    isUnlocked = (data: PersonaAnalysisValues): boolean => return false;
    
    getStepCount = (data: PersonaAnalysisValues): number => data["uploadImage_actions"]?.factors.name.length ?? 0;
    isStepUnlocked = (subStep: number, data:PersonaAnalysisValues): boolean => {
        return subStep < 1 || this.validateStep(subStep - 1, data).length === 0;
    }

    validateStep = (subStep: number, data: PersonaAnalysisValues): UIError[] => {
        const currentAction = data["uploadImage_actions"]?.factors;
        const errors = new Array<UIError>();
        if (currentAction !== undefined) {
            errors.push({id: "general", message: "Daten fehlen", level: "error"});
        } else {
            errors.push({id: "general", message: "Daten fehlen", level: "error"});
        }
        return errors;
    };

    fillFromPreviousValues = (data: PersonaAnalysisValues) => {
        let analysisValues = data["uploadImage_actions"];
        if (analysisValues === undefined) {
            
           
        }

        let previousValues = data["persona-factors"];
        let factors = previousValues?.factors;
        analysisValues = {
            "factors":{
                name: "123",
                vorname: "123",
                alter: "123",
                profibild: "123"
            }
        }
        data["uploadImage_actions"] = analysisValues
       
    };



    deleteData(data: PersonaAnalysisValues): PersonaAnalysisValues {
        let d = ImgFactors.requireData(data);
        d.factors.name = "123"
        d.factors.vorname = ""
        d.factors.alter = ""
        d.factors.profibild = ""
        data["uploadImage_actions"] = d;
        return data;
    }

    validateData(data: PersonaAnalysisValues): UIError[] {
        const errors = Array<UIError>();
        const errorText = (text: string) => `Bitte füllen Sie alle ${text} aus!`;

        return errors;
    }


}
