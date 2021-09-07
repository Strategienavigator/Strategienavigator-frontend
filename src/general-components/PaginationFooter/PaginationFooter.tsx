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

    /**
     * legt fest ob eingaben möglich sein sollen
     */
    disabled?: boolean
}

/**
 *
 */
class PaginationFooter extends Component<PaginationFooterProps, {}> {


    itemClicked(pageNumber: number, e: React.MouseEvent) {
        e.preventDefault();
        if (pageNumber !== this.props.currentPage)
            this.props.pageChosen(pageNumber);
    }

    nextClicked = (e: React.MouseEvent) => {
        e.preventDefault();
        this.props.pageChosen(this.props.currentPage + 1)
    }

    previousClicked = (e: React.MouseEvent) => {
        e.preventDefault();
        this.props.pageChosen(this.props.currentPage - 1)
    }

    render() {
        let active = this.props.currentPage;
        let items = [];

        for (let number = 0; number < 5; number++) {
            let isActive = number === active;
            items.push(
                <PageItem key={number} active={isActive} disabled={!isActive && this.props.disabled}
                          onClick={this.itemClicked.bind(this, number)}>
                    {number + 1}
                </PageItem>,
            );
        }

        return (
            <div>
                <Pagination>
                    <PageItem key={"previous"} disabled={this.props.currentPage === 0 || this.props.disabled}
                              onClick={this.previousClicked}>Vorherige</PageItem>
                    {items}
                    <PageItem key={"next"}
                              disabled={this.props.currentPage === this.props.pageCount - 1 || this.props.disabled}
                              onClick={this.nextClicked}>Nächste</PageItem>
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

