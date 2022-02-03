import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {SWOTAnalysisValues} from "../../SWOTAnalysis";
import {SWOTFactorsComponent} from "./SWOTFactorsComponent";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {CardComponentField} from "../../../../../general-components/CardComponent/CardComponent";


export class SWOTFactors implements StepDefinition<SWOTAnalysisValues>, StepDataHandler<SWOTAnalysisValues>{

    public static min = 2;
    public static max = 8;

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

    fillFromPreviousValues(data: SWOTAnalysisValues): SWOTAnalysisValues {
        return this.deleteData(data);
    }

    private static requireData(data: SWOTAnalysisValues){
        let d = data["swot-factors"];

        if(d === undefined){
            d = {factors:{
                    chances: [],
                    strengths: [],
                    weaknesses: [],
                    risks: []
                }};
        }
        return d;
    }

    private static defaultCardComponent(): CardComponentField{
        return {
            desc:"",
            name:"",
            id:null
        }
    }

    deleteData(data: SWOTAnalysisValues): SWOTAnalysisValues {
        let d = SWOTFactors.requireData(data);
        const defaultData = Array<CardComponentField>(SWOTFactors.min).fill(SWOTFactors.defaultCardComponent());
        d.factors.risks = defaultData.slice();
        d.factors.strengths = defaultData.slice();
        d.factors.chances = defaultData.slice();
        d.factors.weaknesses = defaultData.slice();

        data["swot-factors"] = d;
        return data;
    }





}
