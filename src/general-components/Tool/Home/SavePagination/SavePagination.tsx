import React, {Component, ReactNode} from "react";
import {PaginationResource, SimpleSaveResource} from "../../../Datastructures";
import {PaginationFooter} from "../../../PaginationFooter/PaginationFooter";
import {Loader} from "../../../Loader/Loader";
import {Session} from "../../../Session/Session";
import {getSaves} from "../../../API/calls/Saves";
import {Card, ListGroup, ListGroupItem} from "react-bootstrap";
import {Link} from "react-router-dom";
import {Tool} from "../../Tool";

import './save-pagination.scss'
import {CallInterface} from "../../../API/API";
import {PaginationLoader} from "../../../API/PaginationLoader";


interface SavePaginationState {
    saves: Array<SimpleSaveResource>|null
    page: number
    pageCount: number
    loading: boolean
}

interface SavePaginationProps {
    tool: Tool
}

class SavePagination extends Component<SavePaginationProps, SavePaginationState> {

    private paginationLoader: PaginationLoader<SimpleSaveResource>;

    constructor(props: Readonly<SavePaginationProps> | SavePaginationProps);
    constructor(props: SavePaginationProps, context: any);
    constructor(props: Readonly<SavePaginationProps> | SavePaginationProps, context?: any) {
        super(props, context);
        this.paginationLoader = new PaginationLoader(async (page) => {
            if (Session.isLoggedIn()) {
                let userId = Session.currentUser?.getID() as number;
                return await getSaves(userId, Session.getToken(), this.props.tool.getID(), page);
            }
            return null;
        });
        this.state = {
            page: 1,
            saves: [],
            pageCount: 1,
            loading: false
        }

    }

    private pageChosenCallback = async (currentPage: number) => {
        this.setState({
            page: currentPage,
            loading: true
        });
        let et  = await this.paginationLoader.getPage(currentPage);
        this.setState({
            saves: et,
            loading:false,
            pageCount: this.paginationLoader.pageCount
        });

    };

    async componentDidMount() {
        this.pageChosenCallback(this.state.page);
    }

    render(): ReactNode {
        return (
            <div>
                <Loader payload={[]} loaded={(!this.state.loading)}>

                    <div>
                        {(this.state.saves === null || this.state.saves.length <= 0) && (
                            <Card>
                                <Card.Body>Sie haben aktuell keine Speicherstände.</Card.Body>
                            </Card>
                        )}

                        {this.state.saves?.map(value => {
                            let save = value;
                            return (
                                <Card as={Link} to={this.props.tool?.getLink() + "/" + save.id}
                                      key={save.id} className={"mt-2 mb-2 save-card"}>
                                    <Card.Body className={"save-body"}>
                                        <Card.Title>{save.name}</Card.Title>
                                        <Card.Text
                                            className={"save-desc text-muted mb-1"}>{save.description ? save.description : "Keine Beschreibung vorhanden"}</Card.Text>
                                    </Card.Body>

                                </Card>
                            );
                        })}

                    </div>

                </Loader>
                <div className={"mt-3"}>
                    {this.state.pageCount > 1 && (
                        <PaginationFooter pageCount={this.state.pageCount} pageChosen={this.pageChosenCallback}
                                          currentPage={this.state.page} disabled={this.state.loading}/>)}
                </div>
            </div>
        );
    }
}


export {
    SavePagination
}

export type {
    SavePaginationProps,
    SavePaginationState
}
