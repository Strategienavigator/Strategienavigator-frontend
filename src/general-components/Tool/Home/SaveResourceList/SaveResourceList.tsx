import './save-resource-list.scss'
import React, {Component} from "react";
import {Tool} from "../../Tool";
import {isDesktop} from "../../../Desktop";
import {SavePagination} from "./SavePagination/SavePagination";
import {SaveInfinityScroll} from "./SaveInfinityScroll/SaveInfinityScroll";

interface SaveResourceListProps {
    tool: Tool
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


    constructor(props: Readonly<SaveResourceListProps> | SaveResourceListProps);
    constructor(props: SaveResourceListProps, context: any);
    constructor(props: SaveResourceListProps | Readonly<SaveResourceListProps>, context?: any) {
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
                        <SaveInfinityScroll tool={this.props.tool!}/>
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
