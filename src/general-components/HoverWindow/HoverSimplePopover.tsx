import {Popover} from "react-bootstrap";
import {memo, ReactNode} from "react";

export interface HoverSimplePopoverProps {
    /**
     * Titel des Popovers.
     */
    title?: string,
    /**
     * Beschreibung des Popovers. (Body des Popovers)
     */
    description?: ReactNode;
}

/**
 * Simples Popover mit titel und
 */
export const HoverSimplePopover = memo(function HoverSimplePopover({title, description}: HoverSimplePopoverProps) {
    return (<Popover id="popover-basic">
        {title !== undefined ? (
            <Popover.Header as="h3">{title}</Popover.Header>) : undefined}
        {description !== undefined ? (
            <Popover.Body>
                {description}
            </Popover.Body>) : undefined}
    </Popover>);
});
