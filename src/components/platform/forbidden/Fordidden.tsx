import {Component} from "react";

import "./forbidden.scss";

import stop from "./pictures/stop.webp";


export class Forbidden extends Component<any, any> {

    render() {
        return (
            <div className="wrapper">
                <h1>Fehler 403</h1>
                <h2>Zugang verboten! Erlaubnis verweigert</h2>
                    <div>
                        <img src= {stop}/>
                    </div>
                <h4>Sie haben keine Berechtigung für diese Anfrage</h4>
                <button type="button" className="main-btn">Home</button>
            </div>
        );
    }

}