import {Component} from "react";
import sleep from "./pictures/sleep-icon.png";

import "./not-found.scss";


export class NotFound extends Component<any, any> {

    render() {
        return (
            <div>
                <h2>Ups! Seite nicht gefunden...</h2>

                <img src={sleep} alt={"Bett"}/>

                <p>Die Seite die Sie suchen, wurde leider nicht gefunden!</p>
            </div>
        );
    }

}
