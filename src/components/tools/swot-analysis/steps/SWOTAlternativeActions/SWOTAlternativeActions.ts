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
import {SwotFactorsValues} from "../SWOTFactors/SWOTFactorsComponent";
import {CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";

export class SWOTAlternativeActions implements StepDefinition<SWOTAnalysisValues>, StepDataHandler<SWOTAnalysisValues>, SubStepDefinition<SWOTAnalysisValues> {

    public static minAlternatives = 0;
    public static maxAlternatives = 2;

    public static splitAlternateActionName(name: string) {
        const ids = name.split("-");
        const firstId = ids[0];
        const secondId = ids[1];
        return {firstId: firstId, secondId: secondId};
    }


    public static getActionIds(factors: SwotFactorsValues["factors"]): { firstIds: CardComponentFields, secondIds: CardComponentFields } {
        const firstIds = factors.strengths.concat(factors.weaknesses);
        const secondIds = factors.chances.concat(factors.risks);
        return {firstIds, secondIds}
    }

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

    fillFromPreviousValues = (data: SWOTAnalysisValues) => {
        let analysisValues = data["alternative-actions"];
        if (analysisValues === undefined) {
            analysisValues = {actions: []};
        }

        let previousValues = data["swot-factors"];

        let factors = previousValues?.factors;

        if (factors !== undefined) {
            const {firstIds, secondIds} = SWOTAlternativeActions.getActionIds(factors);

            for (const item1 of firstIds) {
                for (const item2 of secondIds) {
                    analysisValues.actions.push({
                        name: item1.id + "-" + item2.id,
                        hasNone: false,
                        alternatives: []
                    });
                }
            }
        }
        data["alternative-actions"] = analysisValues
    };

    deleteData = (data: SWOTAnalysisValues) => {
        data["alternative-actions"] = undefined;
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


    isStepUnlocked = (subStep: number, data: SWOTAnalysisValues): boolean => {
        return subStep < 1 || this.validateStep(subStep - 1, data).length === 0;
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
