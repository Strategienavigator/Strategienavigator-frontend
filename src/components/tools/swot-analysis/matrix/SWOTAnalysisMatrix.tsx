import { MatrixComponent } from "../../../../general-components/Tool/MatrixComponent/MatrixComponent";
import "./swot-analysis-matrix.scss";
import { Image } from "react-bootstrap";
import Beispiel from "./beispiel.png";


class SWOTAnalysisMatrix extends MatrixComponent<any> {

    render() {                             
        console.log(this.getData());
         
        //Hier entstehen die Punkte für die Chancen
        let headernumber = [];
        let numberLength = 7;
        for (let i = 0; i < numberLength; i++) {
            headernumber[i]= <div>{i +1}</div>;
        }
        
        //Hier entstehen die Punkte für die Stärken
        let headerCapitals = [];
        let headerCapitalLength = 5;
        for (let i = 0; i < headerCapitalLength; i++) {
            headerCapitals[i] = <div>{String.fromCharCode(65 + i)}</div>;
        }
        
        //Hier entstehen die Punkte für die Schwächen
        let leftLetters = [];
        let leftLettersLength = 5;
        for (let i = 0; i < leftLettersLength; i++) {
            leftLetters[i] = <div>{String.fromCharCode(97 + i)}</div>;
        }
        
        //Hier entstehen die Punkte für die Risiken
        let headerRomanCapitals = [];
        let headerRomanCapitalsLength = 5;
        let romanCapitals = ["I","II","III","IV","V","VI","VII","VIII","IX"];
        for (let i = 0; i < headerRomanCapitalsLength; i ++){
            headerRomanCapitals[i] = <div>{romanCapitals[i]}</div>;
        }
        
        //Hier entstehen die Kombinationen zwischen Chancen und Stärken
        let bodyone = [];
        let bodyoneLength = numberLength * headerCapitalLength;
        for (let i = 0; i < bodyoneLength; i++) {
            bodyone[i] = <div></div>;
        }
        
        //Hier entstehen die Kombinationen zwischen Risiken und Stärken
        let bodytwo = [];
        let bodytwoLength = headerRomanCapitalsLength * headerCapitalLength;
        for (let i = 0; i < bodytwoLength; i++) {
            bodytwo[i] = <div></div>;
        }
        
        //Hier entstehen die Kombinationen zwischen Chancen und Schwächen
        let bodythree = [];
        let bodythreeLength = numberLength * leftLettersLength;
        for (let i = 0; i <  bodythreeLength; i++) {
            bodythree[i] = <div></div>;
        }
        
        //Hier entstehen die Kombinationen zwischen Risiken und Schwächen
        let bodyfour = [];
        let bodyfourLength = headerRomanCapitalsLength * leftLettersLength;
        for (let i = 0; i < bodyfourLength; i++) {
            bodyfour[i] = <div></div>;
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

}

export {
    SWOTAnalysisMatrix
}