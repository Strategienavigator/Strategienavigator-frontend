import {Badge, Card, Col, Row} from "react-bootstrap";
import {LastOpenedSaves} from "../LastOpenendSaves/LastOpenedSaves";
import React from "react";
import {User} from "../User";

export interface UserStatisticsProps {
    user: User
}

export function UserStatistics({user}: UserStatisticsProps) {
    return (
        <div>
            <hr/>
            <Card>
                <Card.Header>
                    <h5 className={"mt-2 mb-2"}>Überblick Analysen</h5>
                </Card.Header>
                <Card.Body>
                    <Row>
                        <Col lg={8}>
                            <div>
                                <h5>Zuletzt geöffnet</h5>

                                <hr/>
                                <LastOpenedSaves/>
                            </div>
                        </Col>
                        <Col lg={4}>
                            <div>
                                <h5>Statistiken</h5>

                                <hr/>

                                <Row>
                                    <Col xs={"auto"}>
                                        <Badge bg={"dark"} pill>
                                            {user?.getOwnedSavesAmount()}
                                        </Badge>
                                    </Col>
                                    <Col>
                                        Anzahl eigener Analysen
                                    </Col>
                                </Row>
                                <Row>
                                    <Col xs={"auto"}>
                                        <Badge bg={"dark"} pill>
                                            {user?.getSharedSavesAmount()}
                                        </Badge>
                                    </Col>
                                    <Col>
                                        Anzahl geteilter Analysen
                                    </Col>
                                </Row>
                            </div>
                        </Col>
                    </Row>
                </Card.Body>
            </Card>
            <hr/>
        </div>
    );
}