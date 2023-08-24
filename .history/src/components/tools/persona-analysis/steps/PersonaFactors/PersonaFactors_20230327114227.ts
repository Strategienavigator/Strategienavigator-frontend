import {
    StepDataHandler,
    StepDefinition,
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {PersonaFactorsComponent} from "./PersonaFactorsComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {
    CardComponentField,
    isCardComponentFilled,
    isCardComponentTooLong,
} from "../../../../../general-components/FeaturesItem/CardComponent";
import {CounterInterface} from "../../../../../general-components/Counter/CounterInterface";
import {UpperABCCounter} from "../../../../../general-components/Counter/UpperABCCounter";
import {LowerABCCounter} from "../../../../../general-components/Counter/LowerABCCounter";
import {NumberCounter} from "../../../../../general-components/Counter/NumberCounter";
import {RomanNumeralsCounter} from "../../../../../general-components/Counter/RomanNumeralsCounter";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";


export class PersonaFactors implements StepDefinition<PersonaAnalysisValues>, StepDataHandler<PersonaAnalysisValues>  {

    public static min = 1;
    public static max = 8;


    public static qualifikationCounter = new NumberCounter();
    public static art_der_ErkrankungCounter = new NumberCounter();
    public static beraterOrAngehörigeCounter = new NumberCounter();
    public static familieOrFreundeCounter = new NumberCounter();
    public static charaktereigenschaftenCounter = new NumberCounter();
    public static bedürfnisseCounter = new NumberCounter();
    public static hobiesCounter = new NumberCounter();
    public static motivationCounter = new NumberCounter();
    public static zitatCounter = new NumberCounter();
 

    form: React.FunctionComponent<StepProp<PersonaAnalysisValues>> | React.ComponentClass<StepProp<PersonaAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<PersonaAnalysisValues>;


    constructor() {
        this.id = "persona-info";
        this.title = "2. persona-info";
        this.form = PersonaFactorsComponent;
        this.dataHandler = this;

    }

    public static requireData(data: PersonaAnalysisValues) {
        let d = data["persona-factors"];

        if (d === undefined) {
            d = {
                factors: {
                    qualifikation: [],
                    art_der_Erkrankung: [],
                    beraterOrAngehörige: [],
                    familieOrFreunde: [],
                    charaktereigenschaften: [],
                    bedürfnisse: [],
                    hobies: [],
                    motivation: [],
                    zitat: []
                
                }
            }
        };
        return d;
    }

    public static getDefaultArray(count: CounterInterface) {
        let a = Array<CardComponentField>();
        for (let i = 0; i < PersonaFactors.min; i++) {
            a.push(this.defaultCardComponent(count.get(i + 1)))
        }
        return a;
    }
       //desc is the specific content written name is the title
    private static defaultCardComponent(id: string | null): CardComponentField {
        return {
            desc: "",
            name: "",
            id: id
        }
    }

    // TODO judges whether the previous page is completed, this method is used to mark whether this page is unlocked
    isUnlocked(data: PersonaAnalysisValues): boolean {
        if(data['persona-factors'] === undefined){
            let initData:PersonaAnalysisValues = this.fillFromPreviousValues(data);
            data['persona-factors'] = initData['persona-factors']
        }
        return data['uploadImage_actions']?.factors.name !== undefined&&data['uploadImage_actions']?.factors.surname !== undefined && data['uploadImage_actions']?.factors.name.length > 0 && data['uploadImage_actions']?.factors.surname.length > 0;
    }

    // Fill in the initialized value
   fillFromPreviousValues   (data: PersonaAnalysisValues): PersonaAnalysisValues { 
        return this.deleteData(data);
    }

    // clear the value
    deleteData(data: PersonaAnalysisValues): PersonaAnalysisValues {
       
        let d = PersonaFactors.requireData(data);
        d.factors.qualifikation = [];
        d.factors.art_der_Erkrankung = PersonaFactors.getDefaultArray(PersonaFactors.art_der_ErkrankungCounter);
        d.factors.beraterOrAngehörige = PersonaFactors.getDefaultArray(PersonaFactors.beraterOrAngehörigeCounter);
        d.factors.familieOrFreunde = PersonaFactors.getDefaultArray(PersonaFactors.familieOrFreundeCounter);
        d.factors.charaktereigenschaften = PersonaFactors.getDefaultArray(PersonaFactors.charaktereigenschaftenCounter);
        d.factors.bedürfnisse= PersonaFactors.getDefaultArray(PersonaFactors.bedürfnisseCounter);
        d.factors.hobies = PersonaFactors.getDefaultArray(PersonaFactors.hobiesCounter);
        d.factors.motivation = PersonaFactors.getDefaultArray(PersonaFactors.motivationCounter);
        d.factors.zitat = PersonaFactors.getDefaultArray(PersonaFactors.zitatCounter);
        data["persona-factors"] = d;
        return data;
    }


    validateData(data: PersonaAnalysisValues): UIError[] {
        const errors = Array<UIError>();
        const errorText = (text: string) => `Bitte füllen Sie alle ${text} aus!`;

        if (!isCardComponentFilled(data["persona-factors"]?.factors.qualifikation)) {
            errors.push({
                id: "persona-analysis.qualifikationError",
                message: errorText("qualifikation"),
                level: "error"
            });
        }

        if (!isCardComponentFilled(data["persona-factors"]?.factors.art_der_Erkrankung)) {
            errors.push({
                id: "persona-analysis.art_der_ErkrankungError",
                message: errorText("art_der_Erkrankung"),
                level: "error"
            });
        }

        if (!isCardComponentFilled(data["persona-factors"]?.factors.beraterOrAngehörige)) {
            errors.push({
                id: "persona-analysis.beraterOrAngehörigeError",
                message: errorText("beraterOrAngehörige"),
                level: "error"
            });
        }

        if (!isCardComponentFilled(data["persona-factors"]?.factors.familieOrFreunde)) {
            errors.push({
                id: "persona-analysis.familieOrFreundeError",
                message: errorText("familieOrFreunde"),
                level: "error"
            });
        }

        if (!isCardComponentFilled(data["persona-factors"]?.factors.charaktereigenschaften)) {
            errors.push({
                id: "persona-analysis.charaktereigenschaftenError",
                message: errorText("charaktereigenschaften"),
                level: "error"
            });
        }

        if (!isCardComponentFilled(data["persona-factors"]?.factors.bedürfnisse)) {
            errors.push({
                id: "persona-analysis.bedürfnisseError",
                message: errorText("bedürfnisse"),
                level: "error"
            });
        }

        if (!isCardComponentFilled(data["persona-factors"]?.factors.hobies)) {
            errors.push({
                id: "persona-analysis.hobiesError",
                message: errorText("hobies"),
                level: "error"
            });
        }

        if (!isCardComponentFilled(data["persona-factors"]?.factors.motivation)) {
            errors.push({
                id: "persona-analysis.motivationError",
                message: errorText("motivation"),
                level: "error"
            });
        }

        if (!isCardComponentFilled(data["persona-factors"]?.factors.zitat)) {
            errors.push({
                id: "persona-analysis.zitatError",
                message: errorText("zitat"),
                level: "error"
            });
        }
        
       
        if (
            isCardComponentTooLong(data["persona-factors"]?.factors.qualifikation) ||
            isCardComponentTooLong(data["persona-factors"]?.factors.art_der_Erkrankung) ||
            isCardComponentTooLong(data["persona-factors"]?.factors.beraterOrAngehörige)||
            isCardComponentTooLong(data["persona-factors"]?.factors.familieOrFreunde)||
            isCardComponentTooLong(data["persona-factors"]?.factors.charaktereigenschaften)||
            isCardComponentTooLong(data["persona-factors"]?.factors.bedürfnisse)||
            isCardComponentTooLong(data["persona-factors"]?.factors.hobies)||
            isCardComponentTooLong(data["persona-factors"]?.factors.motivation)||
            isCardComponentTooLong(data["persona-factors"]?.factors.zitat)
           
        ) {
            errors.push({
                id: "persona-analysis.too-long",
                message: "Der Text in einigen Feldern ist zu lang!",
                level: "error"
            });
        }

        return errors;
    }


}