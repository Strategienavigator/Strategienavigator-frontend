import { MatrixComponent } from "../../../../general-components/Tool/MatrixComponent/MatrixComponent";
import "./swot-analysis-matrix.scss";
import { Image } from "react-bootstrap";
import Beispiel from "./beispiel.png";
import {SWOTAnalysisValues} from "../SWOTAnalysis";
import { RomanNumeralsCounter } from "../../../../general-components/Counter/RomanNumeralsCounter";
import { UpperABCCounter } from "../../../../general-components/Counter/UpperABCCounter";
import { LowerABCCounter } from "../../../../general-components/Counter/LowerABCCounter";
import {AlternateAction} from "../steps/SWOTAlternativeActions/SWOTAlternativeActionsComponent";


class SWOTAnalysisMatrix extends MatrixComponent<SWOTAnalysisValues, {}> {

    getAction(actions: any, first: string, second: any): AlternateAction | null {
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
            if(action.hasNone) {
                return "red";
            } else if (action.alternatives.length > 0) {
                return "green";
            }
        }
        return "";
    }

    render() {    
        let data = this.getData() as SWOTAnalysisValues;
        if (data) {        
            let factors = data["swot-factors"].factors;
            let actions = data["alternative-actions"].actions;
            console.log(actions);
            
             
            //Hier entstehen die Punkte für die Chancen
            let headernumber = [];
            let numberLength = factors.chances.length;
            for (let i = 0; i < numberLength; i++) {
                headernumber[i]= <div>{i + 1}</div>;
            }
            
            //Hier entstehen die Punkte für die Stärken
            let headerCapitals = [];
            let headerCapitalLength = factors.strengths.length;
            let upperCounter = new UpperABCCounter();
            for (let i = 1; i < headerCapitalLength + 1; i++) {
                headerCapitals[i] = <div>{upperCounter.get(i)}</div>;
            }
            
            //Hier entstehen die Punkte für die Schwächen
            let leftLetters = [];
            let leftLettersLength = factors.weaknesses.length;
            let lowerCounter = new LowerABCCounter();
            for (let i = 1; i < leftLettersLength + 1; i++) {
                leftLetters[i] = <div>{lowerCounter.get(i)}</div>;
            }
            
            //Hier entstehen die Punkte für die Risiken
            let headerRomanCapitals = [];
            let headerRomanCapitalsLength = factors.risks.length;
            let romanCounter = new RomanNumeralsCounter();
            for (let i = 1; i < headerRomanCapitalsLength + 1; i ++){
                headerRomanCapitals[i] = <div>{romanCounter.get(i)}</div>;
            }
            
            //Hier entstehen die Kombinationen zwischen Chancen und Stärken
            let bodyone = [];
            let j = 0;
            for (let e = 0; e < headerCapitalLength; e++) {
                for  (let i = 0; i < numberLength; i++){
                    let action = this.getAction(actions, upperCounter.get(e + 1) as string, i + 1);
                    bodyone[j] = <div className={this.getClassName(action)}></div>;
                    j++;
                }
            }
            
            //Hier entstehen die Kombinationen zwischen Risiken und Stärken
            let bodytwo = [];
            let bodytwoLength = headerRomanCapitalsLength * headerCapitalLength;
            j = 0;
            for (let e = 0; e < headerCapitalLength; e++) {
                for (let i = 0; i < headerRomanCapitalsLength; i++){
                    let action = this.getAction(actions, upperCounter.get(e + 1) as string, romanCounter.get(i + 1) as string);
                    bodytwo[j] = <div className={this.getClassName(action)}></div>;
                    j++;
                }
            }
            
            //Hier entstehen die Kombinationen zwischen Chancen und Schwächen
            let bodythree = [];
            j = 0;
            for (let e = 0; e < leftLettersLength; e++) {
                for  (let i = 0; i < numberLength; i++){
                    let action = this.getAction(actions, lowerCounter.get(e + 1) as string, i + 1);
                    bodythree[j] = <div className={this.getClassName(action)}></div>;
                    j++;
                }
            }
            
            //Hier entstehen die Kombinationen zwischen Risiken und Schwächen
            let bodyfour = [];
            let bodyfourLength = headerRomanCapitalsLength * leftLettersLength;
            j = 0;
            for (let e = 0; e < leftLettersLength; e++) {
                for (let i = 0; i < headerRomanCapitalsLength; i++){
                    let action = this.getAction(actions, lowerCounter.get(e + 1) as string, romanCounter.get(i + 1) as string);
                    bodyfour[j] = <div className={this.getClassName(action)}></div>;
                    j++;
                }
            }
            
            return (
                <>
                    <div className="alle-container">
                   
                        <div className="flex-container">
                            <div>
                                <div className="page">
                                    <div className="grid-head">
                                        {headernumber}
                                    </div>
            
                                    <div className="grid-left">
                                        {headerCapitals}
                                    </div>
                                     <div className="grid-container">
                                        {bodyone}
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
                                        {bodytwo}
                                    </div>
                                </div>
                            </div>
                        </div>
    
                        <div className="flex-container">
                            <div>
    
                                <div className="page">
                                    <div className="grid-head">
                                        {headernumber}
                                    </div>
                                <div className="grid-left">
                                    {leftLetters}
                                </div>
                                <div className="grid-container"> 
                                    {bodythree}
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
                                        {bodyfour}
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
