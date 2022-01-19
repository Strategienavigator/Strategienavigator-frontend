import React, {Component} from "react";

import './save-infinity-scroll.scss';
import {SimpleSaveResource} from "../../../Datastructures";
import {Tool} from "../../Tool";
import {deleteSave, getSaves} from "../../../API/calls/Saves";
import {DeleteSaveModal} from "../DeleteSaveModal/DeleteSaveModal";
import {PaginationLoader, PaginationPage} from "../../../API/PaginationLoader";
import {Session} from "../../../Session/Session";
import {Card} from "react-bootstrap";
import {SaveCard} from "../SaveCard/SaveCard";
import {Loader} from "../../../Loader/Loader";

export interface SaveInfinityScrollState {
    /**
     * Alle Speicherstände, der Index ist identisch mit der Seitennummer
     */
    saves: Array<PaginationPage<SimpleSaveResource>>
    /**
     * Die letzte geladene Seite (aka. die Anzahl der geladenen Seiten)
     */
    page: number
    pageCount: number
    loading: boolean
    lastDeleteSave: SimpleSaveResource | null
    orderDesc: boolean
}

export interface SaveInfinityScrollProps {
    /**
     * Das Tool für das die Speicherstände angezeigt werden sollen
     */
    tool: Tool
}

export class SaveInfinityScroll extends Component<SaveInfinityScrollProps, SaveInfinityScrollState> {
    private static loadingTriggerModifier = 1;


    private paginationLoader: PaginationLoader<SimpleSaveResource>;
    private isLoading = false;

    constructor(props: SaveInfinityScrollProps, context: any) {
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

        this.isLoading = false;
        this.state = {
            page: 1,
            saves: [],
            pageCount: 1,
            loading: false,
            lastDeleteSave: null,
            orderDesc:true
        };
    }


    componentDidMount() {
        this.loadNewPage(this.state.page,true);
        document.getElementById('content')?.addEventListener('scroll', this.onScroll);
    }


    componentWillUnmount() {
        document.getElementById('content')?.removeEventListener('scroll', this.onScroll);
    }

    render() {
        return (
            <>
                <div className={"savesContainer"}>
                    {((this.state.saves === null || this.state.saves.length <= 0) && !this.state.loading) && (
                        <Card>
                            <Card.Body>Sie haben aktuell keine Speicherstände.</Card.Body>
                        </Card>
                    )}

                    {this.state.saves.flatMap(value => {
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
                    <Loader payload={[]} loaded={!this.state.loading} transparent={true}/>
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
                            this.resetSaves();
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
    private getPageOfSave(id: number) {
        for (let i = 1; i < this.state.saves.length + 1; i++) {
            let savePage = this.state.saves[i];

            if (savePage.data.some(s => s.id === id)) {
                return i;
            }
        }
    }

    /**
     * Löscht alle geladenen Seiten und lädt die erste Seite neu
     * @private
     */
    private resetSaves() {
        this.paginationLoader.clearCache();

        this.isLoading = false;
        this.setState(() => {
            return {
                page: 1,
                saves: [],
                pageCount: 1,
                loading: false,
                lastDeleteSave: null
            }
        },async ()=>{
            await this.loadNewPage(this.state.page, true);
        });
    }

    /**
     * Lädt eine neue Seite, wenn gerade noch keine lädt
     * @param currentPage
     * @param forced
     */
    private loadNewPage = async (currentPage: number, forced?: boolean) => {
        if (!this.isLoading && !this.state.loading) {
            this.isLoading = true;
            this.setState({
                loading: this.isLoading
            });

            let et = await this.paginationLoader.getPage(currentPage, forced);
            this.isLoading = false;
            this.setState((prev) => {
                let newSaves = prev.saves.slice();
                if(!et){
                    delete newSaves[currentPage];
                }else{
                    newSaves[currentPage] = et;
                }


                return {
                    ...prev,
                    saves: newSaves,
                    loading: this.isLoading,
                    pageCount: this.paginationLoader.pageCount,
                    page: currentPage
                }
            });
        }
    };

    /**
     * Lädt eine neue Seite wenn die letzte Seite noch noch nicht die letzte war.
     * @param forced Ob ein Cache berücksichtigt werden soll
     * @private
     */
    private loadNewPageIfExists(forced?: boolean) {
        // -1 weil wir keinen 0 index haben aber dieser trotzdem in der Längenberechnung einbezogen wird
        if (this.state.pageCount > this.state.saves.length - 1) {
            let nextPage = this.state.saves.length;
            this.loadNewPage(nextPage, forced);
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
