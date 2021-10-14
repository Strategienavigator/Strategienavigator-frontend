import {Component} from "react";

import "./about-us.scss";


export class AboutUs extends Component<any, any> {

    render() {
        return (<>
            <header className="head">
                <h2>Über Uns</h2><br/>

            </header>
            <p>
                <h3>Beschreibung</h3>
                Der Strategienavigator bietet als Open-Source-Software eine Reihe von bekannten Planungs- und
                Analysemethoden, welche in einem modernen Design und einfacher Zugänglichkeit zur Verfügung gestellt
                werden.<br/>
                Die Anwendung wird als Web-App (Single-Page-Application) implementiert. Die App wird für Smartphones
                optimiert (Prinzip mobile first), ist aber auf jeder Plattformen mit Browser verfügbar.<br/>
                Der Strategienavigator ist ein Projekt der <a href="https://www.jade-hs.de" rel="noreferrer"
                                                              target="_blank">Jade Hochschule
                Wilhelmshaven/Oldenburg/Elsfleth</a>,
                welches größtenteils von Studenten umgesetzt und gewartet wird.

            </p>
            <p>
                <h3>Historie</h3>
                Der CRM-Navigator wurde 2007 als Open-Source-Software von Prof. Gündling initiert und 2008/09 um
                Strategietools erweitert.
            </p>
            <p>
                <h3>Motivation</h3>
                Wenn Du Interesse daran hast, in einem jungen und agilen Team mitzuwirken, dann melde Dich bei uns. Da
                es ein Open-Source Projekt ist, ist jeder ist herzlich willkommen.
                Du erreichst uns unter der Email: <a
                href={"mailto:strategie-navigator@jade-hs.de?subject=Interesse+Mitwirkung+" + process.env.REACT_APP_NAME}>strategie-navigator@jade-hs.de</a>
            </p>

            <h3>Entwicklerteam</h3>

            <ul>
                <li><a href="https://github.com/Geist5000" rel="noreferrer" target="_blank">Claas Wittig</a></li>
                <li><a href="https://github.com/Marce200700" rel="noreferrer" target="_blank">Marcel Bankert</a></li>
                <li><a href="https://github.com/ma1160" rel="noreferrer" target="_blank">Marco Janssen</a></li>
                <li><a href="https://github.com/nic-schi" rel="noreferrer" target="_blank">Nichlas Schipper</a></li>
                <li><a href="https://github.com/ricom" rel="noreferrer" target="_blank">Rico Meiner</a></li>
            </ul>

            <h3>Projektverantworliche Professoren</h3>
            <ul>
                <li>Prof. Gündling</li>
                <li>Prof. Dr. Prehm</li>
                <li>Prof. Dr. Szeliga</li>
            </ul>


            <h3>Links</h3>
            <p><a href="https://github.com/ricom/toolbox-frontend" rel="noreferrer" target="_blank">Frontend
                Repository</a></p>
            <p><a href="https://github.com/ricom/toolbox-backend" rel="noreferrer" target="_blank">Backend
                Repository</a></p>
            <p><a href="https://trello.com/b/3LQKqFb4/projekt-strategietools" rel="noreferrer"
                  target="_blank">Kanbanboard</a></p>
        </>);
    }

}
