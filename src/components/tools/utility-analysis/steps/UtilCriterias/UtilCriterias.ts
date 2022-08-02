import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UtilityAnalysisValues} from "../../UtilityAnalysis";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {Draft} from "immer";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {UtilCriteriasComponent} from "./UtilCriteriasComponent";
import {
    CardComponentFields,
    isCardComponentFilled,
    isCardComponentTooLong
} from "../../../../../general-components/CardComponent/CardComponent";
import {UACriteriaCustomDescriptionValues} from "./UACriteriaCustomDescription";
import {CompareStarHeader} from "../../../../../general-components/CompareComponent/Header/StarHeader/CompareStarHeader";


class UtilCriterias implements StepDefinition<UtilityAnalysisValues>, StepDataHandler<UtilityAnalysisValues> {
    public static min = 2;
    public static max = 10;

    public static readonly header = new CompareStarHeader(1, 5);

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

    static getDefaultExtraData() {
        return {
            headers: UtilCriterias.header.getHeaders(),
            activeIndices: Array(UtilCriterias.header.getCount()).fill(0).map((_, i) => i + 1)
        };
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
                extra: UtilCriterias.getDefaultExtraData()
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
