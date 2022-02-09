import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {SWOTAnalysisValues} from "../../SWOTAnalysis";
import {SWOTFactorsComponent} from "./SWOTFactorsComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CardComponentField} from "../../../../../general-components/CardComponent/CardComponent";
import {CounterInterface} from "../../../../../general-components/Counter/CounterInterface";
import {UpperABCCounter} from "../../../../../general-components/Counter/UpperABCCounter";
import {LowerABCCounter} from "../../../../../general-components/Counter/LowerABCCounter";
import {NumberCounter} from "../../../../../general-components/Counter/NumberCounter";
import {RomanNumeralsCounter} from "../../../../../general-components/Counter/RomanNumeralsCounter";
import {UIError} from "../../../../../general-components/Error/ErrorBag";


export class SWOTFactors implements StepDefinition<SWOTAnalysisValues>, StepDataHandler<SWOTAnalysisValues> {

    public static min = 2;
    public static max = 8;

    public static strengthsCounter = new UpperABCCounter();
    public static weaknessesCounter = new LowerABCCounter();
    public static chancesCounter = new NumberCounter();
    public static risksCounter = new RomanNumeralsCounter();

    form: React.FunctionComponent<StepProp<SWOTAnalysisValues>> | React.ComponentClass<StepProp<SWOTAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<SWOTAnalysisValues>;

    constructor() {
        this.id = "swot-factors";
        this.title = "1. Faktoren festlegen";
        this.form = SWOTFactorsComponent;
        this.dataHandler = this;
    }

    isUnlocked(data: SWOTAnalysisValues): boolean {
        return true;
    }

    fillFromPreviousValues = (data: SWOTAnalysisValues): SWOTAnalysisValues => this.deleteData(data);

    private static requireData(data: SWOTAnalysisValues) {
        let d = data["swot-factors"];

        if (d === undefined) {
            d = {
                factors: {
                    chances: [],
                    strengths: [],
                    weaknesses: [],
                    risks: []
                }
            };
        }
        return d;
    }

    private static getDefaultArray(count: CounterInterface) {
        let a = Array<CardComponentField>();
        for (let i = 0; i < SWOTFactors.min; i++) {
            a.push(this.defaultCardComponent(count.get(i + 1)))
        }
        return a;
    }

    private static defaultCardComponent(id: string | null): CardComponentField {
        return {
            desc: "",
            name: "",
            id: id
        }
    }

    deleteData(data: SWOTAnalysisValues): SWOTAnalysisValues {
        let d = SWOTFactors.requireData(data);
        d.factors.risks = SWOTFactors.getDefaultArray(SWOTFactors.risksCounter);
        d.factors.strengths = SWOTFactors.getDefaultArray(SWOTFactors.strengthsCounter);
        d.factors.chances = SWOTFactors.getDefaultArray(SWOTFactors.chancesCounter);
        d.factors.weaknesses = SWOTFactors.getDefaultArray(SWOTFactors.weaknessesCounter);

        data["swot-factors"] = d;
        return data;
    }

    validateData(data: SWOTAnalysisValues): UIError[] {
        return [];
    }


}
