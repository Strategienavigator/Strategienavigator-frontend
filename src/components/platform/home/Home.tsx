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
        icon: IconProp
    }[]
}

export class Home extends Component<any, HomeState> {
    private readonly items;

    constructor(props: any) {
        super(props);

        this.state = {
            tools: [
                {
                    name: "Paarweiser Vergleich",
                    icon: faSortAmountDownAlt,
                    link: "/pairwise-comparison"
                },
                {
                    name: "Nutzwertanalyse",
                    icon: faBorderAll,
                    link: "/utility-analysis"
                },
                {
                    name: "SWOT Analyse",
                    icon: faThLarge,
                    link: "/swot-analysis"
                },
                {
                    name: "ABC Analyse",
                    icon: faChartPie,
                    link: "/abc-analysis"
                },
                {
                    name: "Portfolio Analyse",
                    icon: faArrowsAlt,
                    link: "/portfolio-analysis"
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
                        return (
                            <Col key={value.name} as={Link} className={"tool"} to={value.link}>
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
