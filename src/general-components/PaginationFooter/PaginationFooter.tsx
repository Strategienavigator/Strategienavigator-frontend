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
 *
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
                                            // always have at least one page
        for (let number = 1; number <= (this.props.pageCount < 1 ? 1 : this.props.pageCount); number++) {
            let isActive = number === active;
            items.push(
                <PageItem key={number} active={isActive} disabled={!isActive && this.props.disabled}
                          onClick={this.itemClicked.bind(this, number)}>
                    {number}
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

