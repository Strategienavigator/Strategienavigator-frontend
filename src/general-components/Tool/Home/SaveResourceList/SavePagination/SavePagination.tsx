import React, {Component, ReactNode} from "react";
import {SimpleSaveResource} from "../../../../Datastructures";
import {PaginationFooter} from "../../../../PaginationFooter/PaginationFooter";
import {Loader} from "../../../../Loader/Loader";
import {Session} from "../../../../Session/Session";
import {getSaves} from "../../../../API/calls/Saves";
import {Card} from "react-bootstrap";
import {Tool} from "../../../Tool";
import {PaginationLoader} from "../../../../API/PaginationLoader";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import './save-pagination.scss'
import {Link} from "react-router-dom";
import {faSortAmountDown, faSortAmountUp} from "@fortawesome/free-solid-svg-icons";


interface SavePaginationState {
    saves: Array<SimpleSaveResource>
    page: number
    pageCount: number
    total: number
    loading: boolean
    lastDeleteSave: SimpleSaveResource | null
    from: number
    /**
     * Gibt an, ob die Speicherstände nach Erstelldatum absteigend sortiert werden sollen (sonst aufsteigend)
     */
    orderDesc: boolean

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
                return await getSaves(userId, {
                    toolID: this.props.tool.getID(),
                    page: page,
                    orderDesc: this.state.orderDesc
                });
            }
            return null;
        });

        this.state = {
            page: 1,
            saves: [],
            pageCount: 1,
            loading: false,
            lastDeleteSave: null,
            total: 0,
            from: 0,
            orderDesc: true,
        }
    }

    orderingChangedCallback = () => {
        this.setState({
            orderDesc: !this.state.orderDesc
        }, () => {
            this.paginationLoader.clearCache();
            this.pageChosenCallback(1);
        });
    }

    async componentDidMount() {
        await this.pageChosenCallback(this.state.page);
    }

    /**
     * Rendert die Zahlen und welche Speicherstände aktuell angezeigt werden
     * @param top Ob dieser Footer auf der oberen Seite der Seite angezeigt werden soll
     * @private
     */
    private renderFooter(top: boolean) {
        let s = top ? {bottom: 0} : {top: 0};

        let from = this.state.from;
        let to = this.state.from + this.state.saves.length - 1;

        let text: JSX.Element = <>{this.state.total} Speicherstände</>;
        if (this.state.pageCount > 1) {
            text = <>{from + " - " + to} von {this.state.total} Speicherständen</>;
        }else if(this.state.total < 1){
            text = <></>;
        }else if(this.state.total === 1){
            text = <>{this.state.total} Speicherstand</>;
        }


        return (
            <div className={"count-display"}>
                {!this.state.loading && (
                    <>
                    <span
                        className={"text-muted" + (this.state.pageCount > 1 ? " count-display-text" : "")}
                        style={s}>{text}</span>


                        {this.state.pageCount > 1 && (
                            <PaginationFooter pageCount={this.state.pageCount} pageChosen={this.pageChosenCallback}
                                              currentPage={this.state.page} disabled={this.state.loading}/>)}

                        {top && (
                            <button type={"button"} className={"btn btn-primary count-display-sort"}
                                    onClick={this.orderingChangedCallback}>
                                <FontAwesomeIcon icon={this.state.orderDesc ? faSortAmountDown : faSortAmountUp}/>
                            </button>
                        )}

                    </>
                )}


            </div>
        );
    }

    render(): ReactNode {
        return (
            <>
                <div className={"mb-3"}>
                    {this.renderFooter(true)}
                </div>

                <Loader payload={[]} transparent loaded={(!this.state.loading)} alignment={"center"}/>
                <div style={{"visibility": this.state.loading ? "hidden" : "visible"}}>
                    {(this.state.saves.length <= 0) && (
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
                <div className={"mt-2"}>
                    {this.renderFooter(false)}
                </div>
            </>
        );
    }

    private pageChosenCallback = async (currentPage: number, forced?: boolean) => {
        this.setState({
            page: currentPage,
            loading: true
        });

        let et = await this.paginationLoader.getPage(currentPage, forced);
        et = et ?? {page: 1, from: 0, data: []}
        this.setState({
            saves: et.data,
            page: et.page,
            loading: false,
            pageCount: this.paginationLoader.pageCount,
            total: this.paginationLoader.totalResults,
            from: et.from
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
