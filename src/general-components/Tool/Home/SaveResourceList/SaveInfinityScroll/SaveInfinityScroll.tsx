import React, {Component} from "react";

import './save-infinity-scroll.scss';
import {SimpleSaveResource} from "../../../../Datastructures";
import {deleteSave} from "../../../../API/calls/Saves";
import {DeleteSaveModal} from "../../DeleteSaveModal/DeleteSaveModal";
import {Card} from "react-bootstrap";
import {SaveCard} from "../../SaveCard/SaveCard";
import {Loader} from "../../../../Loader/Loader";
import {SaveResourceListProps} from "../SaveResourceList";

export interface SaveInfinityScrollState {

    /**
     * Die letzte geladene Seite (aka. die Anzahl der geladenen Seiten)
     */
    page: number
    lastDeleteSave: SimpleSaveResource | null
    orderDesc: boolean
}

export class SaveInfinityScroll extends Component<SaveResourceListProps, SaveInfinityScrollState> {
    private static loadingTriggerModifier = 1;


    private isLoading = false;

    constructor(props: SaveResourceListProps, context: any) {
        super(props, context);


        this.isLoading = false;
        this.state = {
            page: 1,
            lastDeleteSave: null,
            orderDesc: true
        };
    }


    componentDidMount() {
        // this.loadNewPage(this.state.page, true);
        document.getElementById('content')?.addEventListener('scroll', this.onScroll);
    }


    componentWillUnmount() {
        document.getElementById('content')?.removeEventListener('scroll', this.onScroll);
    }

    render() {

        return (
            <>
                <div className={"savesContainer"}>
                    {(this.props.saves !== undefined && this.props.saves.pages.length <= 0) && (
                        <Card>
                            <Card.Body>Sie haben aktuell keine Speicherstände.</Card.Body>
                        </Card>
                    )}

                    {this.props.saves !== undefined && this.props.saves.pages.flatMap(value => {
                        return value.data.map(v => {
                            let save = v;
                            return (
                                <SaveCard key={save.id} save={save} toolLink={this.props.tool.getLink()}
                                          onTrash={() => {
                                              this.setState({
                                                  lastDeleteSave: save
                                              });
                                          }}/>
                            );
                        })
                    })}
                    <Loader payload={[]} loaded={!this.props.pageIsLoading || this.props.saves === undefined} transparent={true}/>
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
                        }, () => {
                            // alles neue laden, weil keys sonst doppelt sind
                            // TODO only reload own and following pages
                            // this.resetSaves();
                        });
                    }}
                />
            </>
        );
    }

    /**
     * Gibt den die Seite zurück, die den Speicherstand mit der übergebenen ID enthält
     * @param id Id eines Speicherstandes
     * @private
     */
    /*private getPageOfSave(id: number) {
        for (let i = 1; i < this.props.saves.pages.length + 1; i++) {
            let savePage = this.props.saves.pages[i];

            if (savePage.data.some(s => s.id === id)) {
                return i;
            }
        }
    }*/

    /**
     * Lädt eine neue Seite, wenn gerade noch keine lädt
     * @param currentPage
     * @param forced
     */
    private loadNewPage = async (currentPage: number, forced?: boolean) => {
        if (!this.isLoading && !this.props.pageIsLoading) {
            this.props.savesControlCallbacks.loadPage(currentPage);
        }

    };

    /**
     * Lädt eine neue Seite wenn die letzte Seite noch nicht die letzte war.
     * @param forced Ob ein Cache berücksichtigt werden soll
     * @private
     */
    private loadNewPageIfExists(forced?: boolean) {
        if(this.props.saves !== undefined){
            // length -1 weil es keinen 0 index gibt aber dieser trotzdem in der Längenberechnung einbezogen wird
            if (this.props.saves.pageCount > this.props.saves.pages.length - 1) {
                let nextPage = this.props.saves.pages.length;
                this.loadNewPage(nextPage, forced);
            }
        }
    }

    /**
     * Prüft ob neue Daten geladen werden müssen und lädt diese
     * @param event
     */
    private onScroll = (event: Event) => {
        let t = event.target
        if (t) {
            let container = t as HTMLDivElement;
            let shouldLoad = SaveInfinityScroll.shouldLoad(container);
            if (shouldLoad && !this.isLoading) {
                this.loadNewPageIfExists();
            }
        }
    }

    /**
     * Gibt zurück ob die nächsten Daten geladen werden sollen
     *
     * Analysiert den aktuellen Scroll Standpunkt. Der Zeitpunkt des Ladens, kann durch SaveInfinityScroll.loadingTriggerModifier manipuliert werden
     * @param container
     * @private
     */
    private static shouldLoad(container: HTMLDivElement) {

        let overflowHeight = container.scrollHeight - container.offsetHeight;

        let percentageOverflow = overflowHeight / container.scrollHeight;


        let triggerPercent = Math.min(SaveInfinityScroll.loadingTriggerModifier * percentageOverflow, 0.98);
        let scrollPercent = container.scrollTop / overflowHeight;

        return triggerPercent < scrollPercent;
    }
}
