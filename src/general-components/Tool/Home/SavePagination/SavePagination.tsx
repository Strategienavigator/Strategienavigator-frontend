import React, {Component, ReactNode} from "react";
import {SaveResource, SimpleSaveResource} from "../../../Datastructures";
import {PaginationFooter} from "../../../PaginationFooter/PaginationFooter";
import {Loader} from "../../../Loader/Loader";
import {Session} from "../../../Session/Session";
import {deleteSave, getSaves} from "../../../API/calls/Saves";
import {Button, Card} from "react-bootstrap";
import {Tool} from "../../Tool";
import {PaginationLoader} from "../../../API/PaginationLoader";

import './save-pagination.scss'
import {DeleteSaveModal} from "../DeleteSaveModal/DeleteSaveModal";
import {SaveCard} from "../SaveCard/SaveCard";


interface SavePaginationState {
    saves: Array<SimpleSaveResource> | null
    page: number
    pageCount: number
    loading: boolean
    lastDeleteSave: SimpleSaveResource | null
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
                return await getSaves(userId, this.props.tool.getID(), page);
            }
            return null;
        });

        this.state = {
            page: 1,
            saves: [],
            pageCount: 1,
            loading: false,
            lastDeleteSave: null
        }
    }

    async componentDidMount() {
        await this.pageChosenCallback(this.state.page);
    }

    render(): ReactNode {
        return (
            <>
                <Loader payload={[]} transparent loaded={(!this.state.loading)}>

                    <div className={"savesContainer"}>
                        {(this.state.saves === null || this.state.saves.length <= 0) && (
                            <Card>
                                <Card.Body>Sie haben aktuell keine Speicherstände.</Card.Body>
                            </Card>
                        )}

                        {this.state.saves?.map(value => {
                            let save = value;
                            return (
                                <SaveCard key={save.id} save={value} toolLink={this.props.tool.getLink()} onTrash={() => {
                                    this.setState({
                                        lastDeleteSave: save
                                    });
                                }}/>
                            );
                        })}

                    </div>

                </Loader>
                <div className={"mt-3"}>
                    {this.state.pageCount > 1 && (
                        <PaginationFooter pageCount={this.state.pageCount} pageChosen={this.pageChosenCallback}
                                          currentPage={this.state.page} disabled={this.state.loading}/>)}
                </div>

                <DeleteSaveModal
                    show={this.state.lastDeleteSave !== null}
                    save={this.state.lastDeleteSave}
                    onClose={() => {
                        this.setState({
                            lastDeleteSave: null
                        });
                    }}
                    onDelete={async (id) => {
                        await deleteSave(id);
                        this.setState({
                            lastDeleteSave: null
                        }, async () => {
                            await this.pageChosenCallback(this.state.page, true);
                        });
                    }}
                />
            </>
        );
    }

    private pageChosenCallback = async (currentPage: number, forced?: boolean) => {
        this.setState({
            page: currentPage,
            loading: true
        });

        let et = await this.paginationLoader.getPage(currentPage, forced);

        this.setState({
            saves: et,
            loading: false,
            pageCount: this.paginationLoader.pageCount
        });

    };
}

export {
    SavePagination
}

export type {
    SavePaginationProps,
    SavePaginationState
}
