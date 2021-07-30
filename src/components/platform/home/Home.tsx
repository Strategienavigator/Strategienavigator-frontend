import {Component} from "react";
import {Link} from "react-router-dom";
import {Col, Form, FormControl, Row} from "react-bootstrap";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {faArrowsAlt, faChartPie, faSortAmountDownAlt, faThLarge} from "@fortawesome/free-solid-svg-icons";

import "./home.scss";
import "./home-desk.scss";

class Home extends Component<any, any> {

    render() {
        return (
            <div className={"container"}>
                <Form className="d-flex justify-content-center align-items-center">
                    <FormControl
                        size={"sm"}
                        type="search"
                        placeholder="Suchen"
                        aria-label="Suchen"
                    />
                </Form>

                <Row className={"tools"}>
                    <Col as={Link} className={"tool"} to={"/pairwise-comparison"}>
                        <div className={"icon"}>
                            <FontAwesomeIcon icon={faSortAmountDownAlt}/>
                        </div>
                        <div className={"text"}>
                            Paarweiser vergleich
                        </div>
                    </Col>
                    <Col as={Link} className={"tool"} to={"/swot"}>
                        <div className={"icon"}>
                            <FontAwesomeIcon icon={faThLarge}/>
                        </div>
                        <div className={"text"}>
                            SWOT Analyse
                        </div>
                    </Col>
                    <Col as={Link} className={"tool"} to={"/abc"}>
                        <div className={"icon"}>
                            <FontAwesomeIcon icon={faChartPie}/>
                        </div>
                        <div className={"text"}>
                            ABC Analyse
                        </div>
                    </Col>
                    <Col as={Link} className={"tool"} to={"/port"}>
                        <div className={"icon"}>
                            <FontAwesomeIcon icon={faArrowsAlt}/>
                        </div>
                        <div className={"text"}>
                            Portfolio Analyse
                        </div>
                    </Col>
                </Row>
            </div>
        );
    }

}

export default Home;