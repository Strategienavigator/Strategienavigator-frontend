import {Component} from "react";
import {Link} from "react-router-dom";
import {Col, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowsAlt, faBorderAll, faChartPie, faSortAmountDownAlt, faThLarge} from "@fortawesome/free-solid-svg-icons";
import {IconProp} from "@fortawesome/fontawesome-svg-core";

import "./home.scss";
import "./home-desk.scss"


interface HomeState {
    tools: {
        name: string,
        link: string,
        icon: IconProp,
        maintenance: boolean
    }[]
}

export class Home extends Component<any, HomeState> {
    private readonly items;

    constructor(props: any) {
        super(props);

        this.state = {
            tools: [
                {
                    name: "SWOT Analyse",
                    icon: faThLarge,
                    link: "/swot-analysis",
                    maintenance: false
                },
                {
                    name: "Paarweiser Vergleich",
                    icon: faSortAmountDownAlt,
                    link: "/pairwise-comparison",
                    maintenance: true
                },
                {
                    name: "Nutzwertanalyse",
                    icon: faBorderAll,
                    link: "/utility-analysis",
                    maintenance: true
                },
                {
                    name: "ABC Analyse",
                    icon: faChartPie,
                    link: "/abc-analysis",
                    maintenance: true
                },
                {
                    name: "Portfolio Analyse",
                    icon: faArrowsAlt,
                    link: "/portfolio-analysis",
                    maintenance: true
                }
            ]
        }

        this.items = this.state.tools;
    }

    render() {
        return (
            <div className={"container"}>
                <Row className={"tools"}>
                    {(this.state.tools.map(value => {
                        let classes = ["tool"];
                        let title = value.name;

                        if (value.maintenance) {
                            classes.push("maintenance");
                            title = "Diese Analyse befindet sich im Wartungsmodus. Bitte Schauen Sie zu einem späteren Zeitpunkt erneut vorbei.";
                        }

                        return (
                            <Col title={title} key={value.name} as={(value.maintenance) ? Col : Link} className={classes.join(" ")} to={value.link}>
                                <div className={"icon"}>
                                    <div>
                                        <FontAwesomeIcon icon={value.icon}/>
                                    </div>
                                </div>
                                <div className={"text"}>
                                    {value.name}
                                </div>
                            </Col>
                        );
                    }))}
                </Row>
            </div>
        );
    }

}
