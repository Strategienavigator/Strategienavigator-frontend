import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {UtilCriteriasComponent} from "./UtilCriteriasComponent";
import {CompareSymbolHeader} from "../../../../../general-components/CompareComponent/Header/CompareSymbolHeader";
import {
    CardComponentFields,
    isCardComponentFilled, isCardComponentTooLong
} from "../../../../../general-components/CardComponent/CardComponent";
import {UACriteriaCustomDescriptionValues} from "./UACriteriaCustomDescription";

class UtilCriterias implements StepDefinition<UtilityAnalysisValues>, StepDataHandler<UtilityAnalysisValues> {
    public static min = 2;
    public static max = 10;

    private static readonly header = new CompareSymbolHeader(["--", "-", "0", "+", "++"]);

    /**
     * gibt den standard Wert für das extra Feld im CardComponentField zurück
     */
    public static getDefaultExtra(): UACriteriaCustomDescriptionValues {
        return {headers: UtilCriterias.header.getHeaders()};
    }


    dataHandler: StepDataHandler<UtilityAnalysisValues>;
    form: React.FunctionComponent<StepProp<UtilityAnalysisValues>> | React.ComponentClass<StepProp<UtilityAnalysisValues>>;
    id: string;
    title: string;


    constructor() {
        this.id = "ua-criterias";
        this.title = "2. Kriterien";
        this.form = UtilCriteriasComponent;
        this.dataHandler = this;
    }

    deleteData(data: Draft<UtilityAnalysisValues>): void {
        data["ua-criterias"] = undefined;
    }

    fillFromPreviousValues(data: Draft<UtilityAnalysisValues>): void {
        const criterias: CardComponentFields<UACriteriaCustomDescriptionValues> = [];
        for (let i = 0; i < UtilCriterias.min; i++) {
            criterias.push({
                id: null,
                name: "",
                desc: "",
                extra: UtilCriterias.getDefaultExtra()
            });
        }
        data["ua-criterias"] = {criterias: criterias};
    }

    isUnlocked(data: UtilityAnalysisValues): boolean {
        return data["ua-criterias"] !== undefined && Object.keys(data["ua-criterias"]).length > 0;
    }

    validateData(data: UtilityAnalysisValues): UIError[] {
        const erros: UIError[] = [];
        if (!isCardComponentFilled(data["ua-criterias"]?.criterias)) {
            erros.push({
                id: "criterias.empty",
                level: "error",
                message: "Die Kriterien dürfen nicht leer sein!"
            });
        }
        if (isCardComponentTooLong(data["ua-criterias"]?.criterias)) {
            erros.push({
                id: "criterias.too-long",
                level: "error",
                message: "Der Text in einigen Feldern ist zu lang!"
            });
        }

        return erros;
    }


}

export {
    UtilCriterias
}
