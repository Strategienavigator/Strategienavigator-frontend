import React, {Component} from 'react';
import {PageItem, Pagination} from 'react-bootstrap';

import './paginationFooter.scss'

interface PaginationFooterProps {
    /**
     * Anzahl der Seiten, welche zur Auswahl angezeigt werden sollen
     */
    pageCount: number
    /**
     * Welche Seite gerade ausgewählt ist
     *
     * startet bei 0
     */
    currentPage: number
    /**
     * callback, wenn eine Seite ausgewählt wurde
     * @param pageNumber nummer der ausgewählten Seite (startet bei 0)
     */
    pageChosen: (pageNumber: number) => void
}

/**
 *
 */
class PaginationFooter extends Component<PaginationFooterProps, any> {


    constructor(props: Readonly<PaginationFooterProps> | PaginationFooterProps);
    constructor(props: PaginationFooterProps, context: any);
    constructor(props: PaginationFooterProps | Readonly<PaginationFooterProps>, context?: any) {
        super(props, context);
    }

    itemClicked(pageNumber:number, e: React.MouseEvent){
        this.props.pageChosen(pageNumber);
    }

    render() {
        let active = this.props.currentPage;
        let items = [];
        for (let number = 1; number <= 5; number++) {
            items.push(
                <PageItem key={number} active={number === active} onClick={this.itemClicked.bind(this,number)}>
                    {number}
                </PageItem>,
            );
        }

        return (
            <div>
                <Pagination>
                    {items}
                </Pagination>
            </div>);
    }
}

export {
    PaginationFooter
};
export type {
    PaginationFooterProps
};

