import './save-resource-list.scss'
import React from "react";
import {Tool} from "../../Tool";
import {SavePagination} from "./SavePagination/SavePagination";
import {SaveInfinityScroll} from "./SaveInfinityScroll/SaveInfinityScroll";
import {PaginationPages} from "../../../API/PaginationLoader";
import {SimpleSaveResource} from "../../../Datastructures";
import {SavesControlCallbacks, SavesPaginationSetting} from "../ToolHome";
import {useIsDesktop} from "../../../Contexts/DesktopContext";


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


function SaveResourceList(props:SaveResourceListProps) {
    const isDesktop = useIsDesktop();
    return (
        <>
            {
                isDesktop && (
                    <SavePagination {...props}/>
                )
            }
            {
                !isDesktop && (
                    <SaveInfinityScroll {...props}/>
                )
            }
        </>
    );
}

export {
    SaveResourceList
}

export type {
    SaveResourceListProps
}
