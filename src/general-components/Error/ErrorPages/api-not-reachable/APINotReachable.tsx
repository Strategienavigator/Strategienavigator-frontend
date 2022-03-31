import {Component} from "react";

import "./api-not-reachable.scss";


export class APINotReachable extends Component<any, any> {

    render() {
        return (
            <div>
                <h2>Ups! Unsere Datenbank ist aktuell nicht erreichbar...</h2>

                <p>Statische Inhalte können Sie weiterhin abrufen. Wir entschuldigen uns für die
                    Unannehmlichkeiten.</p>


            </div>
        );
    }

}
