import {ExtraWindowComponent} from "../../../../general-components/Tool/ExtraWindowComponent/ExtraWindowComponent";
import "./swot-analysis-matrix.scss";
import {SWOTAnalysisValues} from "../SWOTAnalysis";
import {RomanNumeralsCounter} from "../../../../general-components/Counter/RomanNumeralsCounter";
import {UpperABCCounter} from "../../../../general-components/Counter/UpperABCCounter";
import {LowerABCCounter} from "../../../../general-components/Counter/LowerABCCounter";
import {AlternateAction} from "../steps/SWOTAlternativeActions/SWOTAlternativeActionsComponent";
import {isDesktop} from "../../../../general-components/Desktop";


class SWOTAnalysisMatrix extends ExtraWindowComponent<SWOTAnalysisValues, {}> {

    getAction(actions: any, first: string, second: any): AlternateAction | null {
        console.log(1)
        for (const action of actions) {
            let name = action.name;
            if (name === first + "-" + second) {
                return action;
            }
        }
        return null;
    }

    getClassName(action: AlternateAction | null) {
        if (action) {
            if (action.hasNone) {
                return "red";
            } else if (action.alternatives.length > 0) {
                return "green";
            }
        }
        return "";
    }

    requestSubStep(index: number) {
        this.props.stepController.requestSubStep(index);
    }

    render() {
        
        let data = this.getData() as SWOTAnalysisValues;
        let factors = data["swot-factors"]?.factors;
        let actions = data["alternative-actions"]?.actions;
        if (data && factors && actions) {

            //Hier entstehen die Punkte für die Chancen
            let headerNumber = [];
            let numberLength = factors.chances.length;
            for (let i = 0; i < numberLength; i++) {
                headerNumber[i] = (
                    <div key={"swot-matrix-header-number-" + i}>
                        {i + 1}
                    </div>
                );
            }

            //Hier entstehen die Punkte für die Stärken
            let headerCapitals = [];
            let headerCapitalLength = factors.strengths.length;
            let upperCounter = new UpperABCCounter();
            for (let i = 1; i < headerCapitalLength + 1; i++) {
                headerCapitals[i] = (
                    <div key={"swot-matrix-header-capitals-" + (i - 1)}>
                        {upperCounter.get(i)}
                    </div>
                );
            }

            //Hier entstehen die Punkte für die Schwächen
            let leftLetters = [];
            let leftLettersLength = factors.weaknesses.length;
            let lowerCounter = new LowerABCCounter();
            for (let i = 1; i < leftLettersLength + 1; i++) {
                leftLetters[i] = (
                    <div key={"swot-matrix-lower-letters-" + (i - 1)}>
                        {lowerCounter.get(i)}
                    </div>
                );
            }

            //Hier entstehen die Punkte für die Risiken
            let headerRomanCapitals = [];
            let headerRomanCapitalsLength = factors.risks.length;
            let romanCounter = new RomanNumeralsCounter();
            for (let i = 1; i < headerRomanCapitalsLength + 1; i++) {
                headerRomanCapitals[i] = (
                    <div key={"swot-matrix-roman-letters-" + (i - 1)}>
                        {romanCounter.get(i)}
                    </div>
                );
            }

            let columnSum = numberLength + headerRomanCapitalsLength;

            //Hier entstehen die Kombinationen zwischen Chancen und Stärken
            let bodyOne = [];
            let j = 0;
            for (let e = 0; e < headerCapitalLength; e++) {
                for (let i = 0; i < numberLength; i++) {
                    let index = e * columnSum + i;
                    let action = this.getAction(actions, upperCounter.get(e + 1) as string, i + 1);
                    bodyOne[j] = (
                        <div
                            key={"swot-matrix-c-st-" + e + "-" + i}
                            onClick={this.requestSubStep.bind(this, index)}
                            className={this.getClassName(action)}
                        />
                    );
                    j++;
                }
            }

            //Hier entstehen die Kombinationen zwischen Risiken und Stärken
            let bodyTwo = [];
            j = 0;
            for (let e = 0; e < headerCapitalLength; e++) {
                for (let i = 0; i < headerRomanCapitalsLength; i++) {
                    let index = e * columnSum + i + numberLength;
                    let action = this.getAction(actions, upperCounter.get(e + 1) as string, romanCounter.get(i + 1) as string);
                    bodyTwo[j] = (
                        <div
                            key={"swot-matrix-r-st-" + e + "-" + i}
                            onClick={this.requestSubStep.bind(this, index)}
                            className={this.getClassName(action)}
                        />
                    );
                    j++;
                }
            }

            //Hier entstehen die Kombinationen zwischen Chancen und Schwächen
            let bodyThree = [];
            j = 0;
            for (let e = 0; e < leftLettersLength; e++) {
                for (let i = 0; i < numberLength; i++) {
                    let index = e * columnSum + i + columnSum * headerCapitalLength;
                    let action = this.getAction(actions, lowerCounter.get(e + 1) as string, i + 1);
                    bodyThree[j] = (
                        <div
                            key={"swot-matrix-c-sc-" + e + "-" + i}
                            onClick={this.requestSubStep.bind(this, index)}
                            className={this.getClassName(action)}
                        />
                    );
                    j++;
                }
            }

            //Hier entstehen die Kombinationen zwischen Risiken und Schwächen
            let bodyFour = [];
            j = 0;
            for (let e = 0; e < leftLettersLength; e++) {
                for (let i = 0; i < headerRomanCapitalsLength; i++) {
                    let index = e * columnSum + i + columnSum * headerCapitalLength + numberLength;
                    let action = this.getAction(actions, lowerCounter.get(e + 1) as string, romanCounter.get(i + 1) as string);
                    bodyFour[j] = (
                        <div
                            key={"swot-matrix-r-sc-" + e + "-" + i}
                            onClick={this.requestSubStep.bind(this, index)}
                            className={this.getClassName(action)}
                        />
                    );
                    j++;
                }
            }

            let flexContainerClasses = "flex-container";

            if (!isDesktop()) {
                flexContainerClasses = flexContainerClasses + " flex-center";
            }

            return (
                <>
                    <div className="alle-container">

                        <div className={flexContainerClasses}>

                            <div>
                                <div className="page">
                                    <div className="grid-head">
                                        {headerNumber}
                                    </div>

                                    <div className="grid-left">
                                        {headerCapitals}
                                    </div>
                                    <div className="grid-container">
                                        {bodyOne}
                                    </div>
                                </div>
                            </div>

                            <div>

                                <div className="page">
                                    <div className="grid-head">
                                        {headerRomanCapitals}
                                    </div>
                                    <div className="grid-left">
                                        {headerCapitals}
                                    </div>
                                    <div className="grid-container">
                                        {bodyTwo}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div className={flexContainerClasses}>
                            <div>

                                <div className="page">
                                    <div className="grid-head">
                                        {headerNumber}
                                    </div>
                                    <div className="grid-left">
                                        {leftLetters}
                                    </div>
                                    <div className="grid-container">
                                        {bodyThree}
                                    </div>
                                </div>
                            </div>

                            <div>
                                <div className="page">
                                    <div className="grid-head">
                                        {headerRomanCapitals}
                                    </div>
                                    <div className="grid-left">
                                        {leftLetters}
                                    </div>
                                    <div className="grid-container">
                                        {bodyFour}
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                </>
            );
        }
        return "";
    }

}

export {
    SWOTAnalysisMatrix
}
