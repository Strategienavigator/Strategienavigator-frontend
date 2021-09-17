import React, {Component, ComponentPropsWithoutRef} from 'react';
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
     * startet bei 1
     */
    currentPage: number
    /**
     * callback, wenn eine Seite ausgewählt wurde
     * @param pageNumber nummer der ausgewählten Seite (startet bei 1)
     */
    pageChosen: (pageNumber: number) => void

    /**
     * legt fest ob eingaben möglich sein sollen
     */
    disabled?: boolean
}

/**
 * Komponent, welche eine Pagination Leiste anzeigt.
 */
class PaginationFooter extends Component<PaginationFooterProps, {}> {


    static defaultProps = {
        currentPage: 1
    };

    itemClicked(pageNumber: number, e: React.MouseEvent) {
        e.preventDefault();
        if (pageNumber !== this.props.currentPage)
            this.props.pageChosen(pageNumber);
    }

    nextClicked = (e: React.MouseEvent) => {
        e.preventDefault();
        this.props.pageChosen(this.props.currentPage + 1)
    };

    previousClicked = (e: React.MouseEvent) => {
        e.preventDefault();
        this.props.pageChosen(this.props.currentPage - 1)
    };

    render() {
        // clamp active value between 1 and this.props.pageCount
        let active = this.props.currentPage < 1 ? 1 : (this.props.currentPage > this.props.pageCount ? this.props.pageCount : this.props.currentPage);
        let items = [];
        // clamp value to always be above one
        let maxPages = (this.props.pageCount < 1 ? 1 : this.props.pageCount);
        for (let i = 1; i <= maxPages; i++) {
            let isActive = i === active;
            items.push(
                <PageItem key={i} active={isActive} disabled={!isActive && this.props.disabled}
                          onClick={this.itemClicked.bind(this, i)}>
                    {i}
                </PageItem>,
            );
        }

        return (
            <Pagination className={"paginationContainer"}>
                <PageItem key={"previous"} disabled={this.props.currentPage === 1 || this.props.disabled}
                          onClick={this.previousClicked}>Vorherige</PageItem>
                {items}
                <PageItem key={"next"}
                          disabled={this.props.currentPage === this.props.pageCount || this.props.disabled}
                          onClick={this.nextClicked}>Nächste</PageItem>
            </Pagination>);
    }
}

export {
    PaginationFooter
};
export type {
    PaginationFooterProps
};

