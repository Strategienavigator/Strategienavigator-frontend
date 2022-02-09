import {
    CustomNextButton,
    StepDataHandler,
    StepDefinition, SubStepDefinition
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/StepComponent";
import {SWOTAnalysisValues} from "../../SWOTAnalysis";
import {AlternateAction, SWOTAlternativeActionsComponent} from "./SWOTAlternativeActionsComponent";
import {SWOTAnalysisMatrix} from "../../matrix/SWOTAnalysisMatrix";
import {MatrixComponentProps} from "../../../../../general-components/Tool/MatrixComponent/MatrixComponent";
import React from "react";
import {StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {UIError} from "../../../../../general-components/Error/ErrorBag";

export class SWOTAlternativeActions implements StepDefinition<SWOTAnalysisValues>, StepDataHandler<SWOTAnalysisValues>, SubStepDefinition<SWOTAnalysisValues> {

    public static minAlternatives = 0;
    public static maxAlternatives = 2;

    form: React.FunctionComponent<StepProp<SWOTAnalysisValues>> | React.ComponentClass<StepProp<SWOTAnalysisValues>>;
    id: string;
    title: string;
    matrix: React.FunctionComponent<MatrixComponentProps<SWOTAnalysisValues>> | React.ComponentClass<MatrixComponentProps<SWOTAnalysisValues>>;
    dataHandler: StepDataHandler<SWOTAnalysisValues>;
    subStep: SubStepDefinition<SWOTAnalysisValues>;
    customNextButton: CustomNextButton;
    hasCustomNextButton: boolean;


    constructor() {
        this.id = "alternative-actions";
        this.title = "2. Handlungsalternativen festlegen";
        this.form = SWOTAlternativeActionsComponent;
        this.matrix = SWOTAnalysisMatrix;
        this.dataHandler = this;

        // sub step
        this.subStep = this;
        this.hasCustomNextButton = true;
        this.customNextButton = {text: "Nächster"};
    }

    isUnlocked = (data: SWOTAnalysisValues): boolean => (data["alternative-actions"]?.actions.length ?? 0) > 0;

    fillFromPreviousValues = (data: SWOTAnalysisValues): SWOTAnalysisValues => {
        let analysisValues = data["alternative-actions"];
        if (analysisValues === undefined) {
            analysisValues = {actions: []};
        }

        let previousValues = data["swot-factors"];

        let factors = previousValues?.factors;

        if (factors !== undefined) {
            let strengths = factors.strengths;
            let weaknesses = factors.weaknesses;
            let chances = factors.chances;
            let risks = factors.risks;

            for (const item1 of strengths.concat(weaknesses)) {
                for (const item2 of chances.concat(risks)) {
                    analysisValues.actions.push({
                        name: item1.id + "-" + item2.id,
                        first: item1,
                        second: item2,
                        hasNone: false,
                        alternatives: []
                    });
                }
            }
        }
        data["alternative-actions"] = analysisValues
        return data;
    };

    deleteData = (data: SWOTAnalysisValues): SWOTAnalysisValues => {
        data["alternative-actions"] = undefined;
        return data;
    };

    validateData = (data: SWOTAnalysisValues): UIError[] => {
        const actions = data["alternative-actions"]?.actions;
        const errors = new Array<UIError>();
        if (actions !== undefined) {
            for (let i = 0; i < actions.length; i++) {
                errors.push(...this.validateStep(i, data));
            }
        } else {
            errors.push({id: "general", message: "Daten fehlen", level: "error"});
        }
        return errors;
    };


    getStepCount = (data: SWOTAnalysisValues): number => data["alternative-actions"]?.actions.length ?? 0;


    isStepUnlocked = (subStep: number, data: SWOTAnalysisValues): boolean  => {
        return subStep < 1 || this.validateStep(subStep-1, data).length === 0;
    }

    validateStep = (subStep: number, data: SWOTAnalysisValues): UIError[] => {
        const currentAction = data["alternative-actions"]?.actions[subStep];
        const errors = new Array<UIError>();
        if (currentAction !== undefined) {
            errors.push(...SWOTAlternativeActions.validateAction(currentAction));
        } else {
            errors.push({id: "general", message: "Daten fehlen", level: "error"});
        }
        return errors;
    };


    private static validateAction(action: AlternateAction): UIError[] {
        const errors = new Array<UIError>();

        if (action.hasNone) {
            return errors;
        }

        if (action.alternatives.length <= 0) {
            errors.push({
                id: "alternative-action",
                message: "Bitte wählen Sie eine Handlungsalternative!",
                level: "error"
            });
        }

        let values = action.alternatives;
        for (const result of values) {
            if (result.name.length <= 0 || result.desc.length <= 0) {
                errors.push({
                    id: "alternative-action",
                    message: "Überprüfen Sie Ihre getätigten Handlungsalternativen!",
                    level: "error"
                });
            }
        }

        return errors;
    }


}
