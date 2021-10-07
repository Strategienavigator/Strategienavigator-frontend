import { Component } from "react";

import "./about-us.scss";


export class AboutUs extends Component<any, any> {

    render() {
        return (<>
            <header className="head">
                <h2>Über Uns</h2><br />

            </header>
            <p>
                <h3>Beschreibung</h3>
                Der Strategienavigator bietet als Open-Source-Software eine Reihe von bekannten Planungs- und Analysemethoden, welche in einem modernen Design und einfacher Zugänglichkeit zur Verfügung gestellt werden.<br />
                Die Anwendung wird als Web-App (Single-Page-Application) implementiert. Die App wird für Smartphones optimiert (Prinzip mobile first), ist aber auf jeder Plattformen mit Browser verfügbar.<br />
                Der Strategienavigator ist ein Projekt der <a href="https://www.jade-hs.de" target="_blank">Jade Hochschule Wilhelmshaven/Oldenburg/Elsfleth</a>,
                welches größtenteils von Studenten umgesetzt und gewartet wird.

            </p>
            <p>
                <h3>Historie</h3>
                Der CRM-Navigator wurde 2007 als Open-Source-Software entwickelt und 2008/09 um Strategietools erweitert. Das Projekt wurden von Prof. Gündling initiert und von <a href="https://www.adiwidjaja.com/" target="_blank">Adiwidjaja Teamworks</a> umgesetzt.
            </p>

            <p>
                <h3>Allgemeines</h3>
                Ziel und Zweck Dieses Projekt soll die alte Version der Strategie-Tools aufgreifen und auf Ihrer Basis ein
                komplett neues Programm entwickeln, <br />
                welches die bereits vorhandenen Funktionen
                ebenfalls unterstützt.
            </p>
            <p>
                <h3>Ausgangssituation </h3>
                Geschichte der Stragie-Tools hinzufügen (Rico) Es liegt eine alte Version des Strategie-Tools vor. Es wurde bereits teile eines Mookups
                erstellt, <br />
                indem das Aussehen und die Interaktion mit den Oberflächen dargestellt ist. Es ist
                mit Miro erstellt und unter diesem Link, <br />
                verfügbar: <a href="https://miro.com/welcomeonboard/8y4Fl04bvcHxpV3Dxmd8NvCiJMvyO3VE6IyvxvXGPWoU" target="_blank">MIRO</a>
            </p>




            <h3>Teams und Schnittstellen</h3>

            <table className="table1">

                <tr>
                    <th>Rolle(n)</th>
                    <th>Name</th>

                </tr>
                <tr>
                    <td>Entwickler</td>
                    <td><a href="https://github.com/nic-schi" target="_blank">Nichlas</a></td>
                </tr>
                <tr>
                    <td>Entwickler</td>
                    <td><a href="https://github.com/ma1160" target="_blank">Marco</a></td>

                </tr>
                <tr>
                    <td>Entwickler</td>
                    <td>Dietmar</td>

                </tr>
                <tr>
                    <td>Entwickler</td>
                    <td><a href="https://github.com/Hoschmeister" target="_blank">Steven</a></td>
                </tr>
                <tr>
                    <td>Product Owner</td>
                    <td><a href="https://github.com/Geist5000" target="_blank">Claas</a></td>

                </tr>
                <tr>
                    <td>Product Owner</td>
                    <td><a href="https://github.com/ricom" target="_blank">Rico</a></td>
                </tr>
                <tr>
                    <td>Scrum Master</td>
                    <td><a href="https://github.com/Marce200700" target="_blank">Marcel</a></td>

                </tr>
            </table>
            <h3>Github</h3>
            <p><a href="https://github.com/ricom/toolbox-frontend" target="_blank">Frontend Repository</a></p>
            <p><a href="https://github.com/ricom/toolbox-backend" >Backend Repository</a></p>
        </>);
    }

}
