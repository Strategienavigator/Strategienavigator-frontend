import {Component} from "react";

import {Link} from "react-router-dom"

import "./about-us.scss";


export class AboutUs extends Component<any, any> {

    private static developers = [{
        link: "https://github.com/Geist5000",
        displayName: "Claas Wittig"
    }, {
        link: "https://github.com/Gomanius",
        displayName: "Goman Müstak"
    }, {
        link: "https://github.com/Marce200700",
        displayName: "Marcel Bankert"
    }, {
        link: "https://github.com/ma1160",
        displayName: "Marco Janssen"
    }, {
        link: "https://github.com/nic-schi",
        displayName: "Nichlas Schipper"
    }, {
        link: "https://github.com/ricom",
        displayName: "Omar Kanoune"
    }, {
        link: "https://github.com/ricom",
        displayName: "Rico Meiner"
    }];


    constructor(props: any);
    constructor(props: any, context: any);
    constructor(props: any, context?: any) {
        super(props, context);

        AboutUs.developers.sort((a, b) => a.displayName.localeCompare(b.displayName));
    }

    render() {

        const developerList = [];

        for (const developer of AboutUs.developers) {
            developerList.push(
                <li><a href={developer.link} rel="noreferrer" target="_blank">{developer.displayName}</a></li>
            );
        }


        return (<>
            <h2>Über Uns</h2>

            <hr/>

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
                Strategietools erweitert. Rico Meiner verantwortet die technische und organisatorische Umsetzung.
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
                {developerList}
            </ul>

            <h3>Projektverantworliche Professoren</h3>
            <p>
                Gesamtverantwortlich ist Prof. Gündling. Dieser hat auch die Verantwortung für die folgenden Tools:
            </p>
            <ul>
                <li><Link to={"/swot-analysis"}>SWOT-Analyse</Link></li>
                <li><Link to={"/pairwise-comparison"}>Paarweiser Vergleich</Link></li>
                <li><Link to={"/utility-analysis"}>Nutzwertanalyse</Link></li>
                <li><Link to={"/portfolio-analysis"}>Portfolioanalyse</Link></li>
            </ul>
            <p>
                Kolleginnen und Kollegen sind herzlich eingeladen weitere Tools unter deren eigener Verantwortung zu
                integrieren.
            </p>

            {/*<ul>
                <li>Prof. Dr. Prehm</li>
                <li>Prof. Dr. Szeliga</li>
            </ul>*/}


            <h3>Links</h3>
            <p><a href="https://github.com/ricom/toolbox-frontend" rel="noreferrer" target="_blank">Frontend
                Repository</a></p>
            <p><a href="https://github.com/ricom/toolbox-backend" rel="noreferrer" target="_blank">Backend
                Repository</a></p>
            <p><a href="https://trello.com/b/3LQKqFb4/projekt-strategietools" rel="noreferrer"
                  target="_blank">Kanbanboard</a></p>

            <p>Version: <span className={"text-muted"}> {process.env.REACT_APP_VERSION}</span></p>

        </>);
    }

}
