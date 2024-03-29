import './save-resource-list.scss'
import React, {Component} from "react";
import {Tool} from "../../Tool";
import {isDesktop} from "../../../Desktop";
import {SavePagination} from "./SavePagination/SavePagination";
import {SaveInfinityScroll} from "./SaveInfinityScroll/SaveInfinityScroll";
import {PaginationPages} from "../../../API/PaginationLoader";
import {SimpleSaveResource} from "../../../Datastructures";
import {SavesControlCallbacks, SavesPaginationSetting} from "../ToolHome";


interface SaveResourceListProps {
    tool: Tool<any>
    /**
     * Alle Speicherstände und zugehörige Metadaten der Pagination
     */
    saves?: PaginationPages<SimpleSaveResource>

    savesControlCallbacks: SavesControlCallbacks

    paginationSettings: SavesPaginationSetting

    pageIsLoading: boolean
}

interface SaveResourceListState {

}


class SaveResourceList extends Component<SaveResourceListProps, SaveResourceListState> {

    public constructor(props: Readonly<SaveResourceListProps> | SaveResourceListProps);
    public constructor(props: SaveResourceListProps, context: any);
    public constructor(props: SaveResourceListProps | Readonly<SaveResourceListProps>, context?: any) {
        super(props, context);
    }

    render() {
        return (
            <>
                {
                    isDesktop() && (
                        <SavePagination {...this.props}/>
                    )
                }
                {
                    !isDesktop() && (
                        <SaveInfinityScroll {...this.props}/>
                    )
                }
            </>
        );
    }
}

export {
    SaveResourceList,

}

export type {
    SaveResourceListProps,
    SaveResourceListState
}
