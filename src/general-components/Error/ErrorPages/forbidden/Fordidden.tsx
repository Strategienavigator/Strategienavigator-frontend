import {Component} from "react";
import stop from "./pictures/stop.webp";

import "./forbidden.scss";


export class Forbidden extends Component<any, any> {

    render() {
        return (
            <div>
                <h2>Zugang verboten! Erlaubnis verweigert...</h2>

                <img src={stop} alt={"Hand"}/>

                <p>Sie haben keine Berechtigung für diese Anfrage!</p>
            </div>
        );
    }

}
