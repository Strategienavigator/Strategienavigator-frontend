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

    /**
     * Anzahl der gleichzeitig angezeigten Seiten, Ungerade zahlen sehen besser aus. Min: 5
     */
    maxPagesShown: number
}

/**
 * Komponente, welche eine Pagination Leiste anzeigt.
 */
class PaginationFooter extends Component<PaginationFooterProps, {}> {


    static defaultProps = {
        currentPage: 1,
        maxPagesShown: 7
    };

    /**
     * callback wenn ein eine Zahl der PageItems gedrückt wird
     * @param pageNumber
     * @param e
     */
    itemClicked(pageNumber: number, e: React.MouseEvent) {
        e.preventDefault();
        if (pageNumber !== this.props.currentPage)
            this.props.pageChosen(pageNumber);
    }

    /**
     * callback wenn auf den "Next" Knopf gedrückt wird
     * @param e Mouse Event
     */
    nextClicked = (e: React.MouseEvent) => {
        e.preventDefault();
        this.props.pageChosen(this.props.currentPage + 1)
    };

    /**
     * callback wenn auf den "Vorherigen" Knopf gedrückt wird
     * @param e Mouse Event
     */
    previousClicked = (e: React.MouseEvent) => {
        e.preventDefault();
        this.props.pageChosen(this.props.currentPage - 1)
    };

    /**
     * Gibt alle nummern die angezeigt werden als array zurück. Wenn ein Wert -1 ist, muss eine ellipsis angezeigt werden.
     */
    getNumbers = () => {
        let numbers = new Array<number>();
        // clamp value to always be above one
        let maxPages = (this.props.pageCount < 1 ? 1 : this.props.pageCount);

        let diff = maxPages - this.props.maxPagesShown;

        if (diff > 0) {
            diff++;
        }

        let leftSkip = 0;
        let rightSkip = 0;


        if (diff > 0) {


            let rightSpace = maxPages - 1 - this.props.currentPage;

            let leftSpace = this.props.currentPage - 2;

            let spaceDiff = rightSpace - leftSpace;

            if (Math.abs(spaceDiff) < diff) {
                diff += 1;
            }

            let skipDiff = Math.min(Math.abs(spaceDiff), diff);
            if (spaceDiff >= 0) {
                rightSkip += skipDiff;
                diff -= skipDiff;
            } else {
                leftSkip += skipDiff;
                diff -= skipDiff;
            }

            while (diff > 1) {
                diff -= 2;
                rightSkip++;
                leftSkip++;
            }

            if (diff === 1) {
                if (this.props.currentPage / maxPages > 0.5) {
                    leftSkip++;
                } else {
                    rightSkip++;
                }
            }
        }

        numbers.push(1);
        if (leftSkip > 0)
            numbers.push(-1);

        for (let i = 2 + leftSkip; i < maxPages - rightSkip; i++) {
            numbers.push(i);
        }

        if (rightSkip > 0) {
            numbers.push(-1);
        }
        if (numbers[numbers.length - 1] !== maxPages) {
            numbers.push(maxPages);
        }

        return numbers;

    }

    /**
     * Erstellt alle PageItem Tags als Array
     */
    getNumberButtons = () => {
        let active = this.props.currentPage < 1 ? 1 : (this.props.currentPage > this.props.pageCount ? this.props.pageCount : this.props.currentPage);

        let numbers = this.getNumbers();


        return numbers.map((i, index) => {
            let isActive = i === active;
            if (i === -1) {
                return (
                    <PageItem key={"ellipsis" + index} disabled={true}>
                        ...
                    </PageItem>)
            } else {
                return (
                    <PageItem key={i} active={isActive} disabled={!isActive && this.props.disabled}
                              onClick={this.itemClicked.bind(this, i)}>
                        {i}
                    </PageItem>);
            }

        });
    }

    /**
     * Rendert die Komponente
     */
    render() {
        // clamp active value between 1 and this.props.pageCount

        let items = this.getNumberButtons();
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

