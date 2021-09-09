import {Component} from "react";

import "./notfound.scss";

import stop from "./pictures/sleep-icon.png";


export class NotFound extends Component<any, any> {

    render() {
        return (
            <div className="wrapper">
        <h1>Fehler 404</h1>
        <h2>Ups! Seite nicht gefunden</h2>
        <div>
            <img src={stop}/>
        </div>
        <h4>Die Seite die Sie suchen, wurde leider nicht gefunden</h4>
        <button type="button" className="main-btn">Home</button>
    </div>
        );
    }

}