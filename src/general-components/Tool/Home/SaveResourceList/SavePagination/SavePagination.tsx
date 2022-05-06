import React, {Component, ReactNode} from "react";
import {SimpleSaveResource} from "../../../../Datastructures";
import {PaginationFooter} from "../../../../PaginationFooter/PaginationFooter";
import {Card} from "react-bootstrap";

import './save-pagination.scss'
import {SaveResourceListProps} from "../SaveResourceList";
import {SaveCard} from "../../SaveCard/SaveCard";


interface SavePaginationState {
    page: number
    lastDeleteSave: SimpleSaveResource | null
}


class SavePagination extends Component<SaveResourceListProps, SavePaginationState> {

    constructor(props: Readonly<SaveResourceListProps> | SaveResourceListProps);
    constructor(props: SaveResourceListProps, context: any);
    constructor(props: Readonly<SaveResourceListProps> | SaveResourceListProps, context?: any) {
        super(props, context);

        this.state = {
            page: 1,
            lastDeleteSave: null,
        }
    }

    async componentDidMount() {
        await this.pageChosenCallback(this.state.page);
    }

    render(): ReactNode {
        this.checkPage();

        let page = this.getCurrentPage();
        return (
            <>
                <div className={"mb-3"}>
                    {this.renderFooter(true)}
                </div>

                <div>
                    {((page ? page.data.length : 1) <= 0) && (
                        <Card>
                            <Card.Body>Sie haben aktuell keine Speicherstände.</Card.Body>
                        </Card>
                    )}

                    {page?.data.map(save => {
                        return (
                            <SaveCard key={save.tool_id + " " +  save.id} save={save} toolLink={this.props.tool!.getLink()} onTrash={() => {
                                this.props.savesControlCallbacks.deleteSave(save);
                            }}/>
                        );
                    })
                    ?? // alternative if page is undefined
                    Array.from(new Array(15).keys()).map(value => {
                        return (
                            <SaveCard/>
                        );
                    })}

                </div>
                <div className={"mt-2"}>
                    {this.renderFooter(false)}
                </div>
            </>
        );
    }

    /**
     * Rendert die Zahlen und welche Speicherstände aktuell angezeigt werden
     * @param top Ob dieser Footer auf der oberen Seite der Seite angezeigt werden soll
     * @private
     */
    private renderFooter(top: boolean) {
        let s = top ? {bottom: 0} : {top: 0};
        let page = this.getCurrentPage();
        let saves = this.props.saves;

        let text: JSX.Element = <></>;
        if (this.props.saves !== undefined) {
            saves = this.props.saves; // <- type checking things
            text = <>{saves.totalResults} Speicherstände</>;
            if (page !== undefined) {
                let from = page.from;
                let to = from + page.data.length - 1;


                if (saves.pageCount > 1) {
                    text = <>{from + " - " + to} von {saves.totalResults} Speicherständen</>;
                } else if (saves.totalResults < 1) {
                    text = <></>;
                } else if (saves.totalResults === 1) {
                    text = <>{saves.totalResults} Speicherstand</>;
                }
            }
        }
        return (
            <div className={"count-display mb-1"}>
                    <span
                        className={"text-muted count-display-text"}
                        style={s}>{text}</span>


                {saves !== undefined && saves.pageCount > 1 && (
                    <PaginationFooter pageCount={saves.pageCount} pageChosen={this.pageChosenCallback}
                                      currentPage={this.state.page} disabled={this.props.pageIsLoading}/>)}
            </div>
        );

    }

    /**
     * Prüft ob die Seite gültig ist und ändert die state variable wenn die Seite ungügltig ist
     * @private
     */
    private checkPage() {
        let currentPage = this.getCurrentPage();
        let pages = this.props.saves?.pages;
        if (pages !== undefined && !this.props.pageIsLoading) {
            if (currentPage === undefined) {
                for (const page of pages) {
                    if (page !== undefined) {
                        this.setState({
                            page: page.page
                        })
                    }
                }
            }
        }
    }

    private pageChosenCallback = async (nextPage: number, forced?: boolean) => {
        let requestedPage = this.getPage(nextPage);
        this.setState({
            page: nextPage
        });
        if (requestedPage === undefined) {
            this.props.savesControlCallbacks.loadPage(nextPage);
            return;
        }


    }

    private getCurrentPage() {
        return this.getPage(this.state.page);
    }

    private getPage(page: number) {
        if (this.props.saves !== undefined) {
            return this.props.saves.pages[page];
        }
        return undefined;
    }
}

export {
    SavePagination
}


export type {
    SavePaginationState
}
