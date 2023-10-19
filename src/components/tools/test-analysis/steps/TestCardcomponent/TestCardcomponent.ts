import {
    StepDataHandler,
    StepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {UIError} from "../../../../../general-components/Error/UIErrors/UIError";
import {Draft} from "immer";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {ComponentClass, FunctionComponent} from "react";
import {TestAnalysisValues} from "../../TestAnalysis";
import {TestCardcomponentComponent} from "./TestCardcomponentComponent";
import {
    isCardComponentFilled,
    isCardComponentTooLong
} from "../../../../../general-components/CardComponent/CardComponent";

class TestCardcomponent implements StepDefinition<TestAnalysisValues>, StepDataHandler<TestAnalysisValues> {
    form: FunctionComponent<StepProp<TestAnalysisValues>> | ComponentClass<StepProp<TestAnalysisValues>>;
    id: string;
    title: string;
    dataHandler: StepDataHandler<TestAnalysisValues>;

    constructor() {
        this.id = "test-cardcomponent";
        this.title = "1. CardComponent";
        this.dataHandler = this;
        this.form = TestCardcomponentComponent;
    }

    deleteData(data: Draft<TestAnalysisValues>): void {
        data["test-cardcomponent"] = undefined;
    }

    fillFromPreviousValues(data: Draft<TestAnalysisValues>): void {
        data["test-cardcomponent"] = {
            cards: []
        };
    }

    isUnlocked(data: TestAnalysisValues): boolean {
        return data["test-cardcomponent"] !== undefined;
    }

    validateData(data: TestAnalysisValues): UIError[] {
        let errors: UIError[] = [];
        let cards = data["test-cardcomponent"]?.cards;

        if (!isCardComponentFilled(cards)) {
            errors.push({
                id: "empty",
                message: "Bitte füllen Sie alle Felder aus!",
                level: "error"
            });
        }

        if (isCardComponentTooLong(cards)) {
            errors.push({
                id: "toolong",
                message: "Einige Felder sind zu Lang!",
                level: "error"
            });
        }

        return errors;
    }


}

export {
    TestCardcomponent
}