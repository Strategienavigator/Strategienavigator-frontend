import FAE from "../../../../../general-components/Icons/FAE";
import React from "react";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {ListGroup, ListGroupItem} from "react-bootstrap";

import "./persona-info-item.scss";

export interface PersonaInfoItemProps {
    title: string,
    icon?: IconDefinition,
    items: CardComponentFields,
    className?: string
}

function PersonaInfoItem(props: PersonaInfoItemProps) {
    if (props.items.length <= 0) {
        return null;
    }

    return (
        <div className={"info-container" + (props.className !== undefined ? ` ${props.className}` : "")}>
            <div className={"title"}>
                {props.icon && (
                    <>
                        <FAE icon={props.icon} className={"icon"}/>&nbsp;
                    </>
                )}
                {props.title}
            </div>
            <div className={"content"}>
                <ListGroup>
                    {props.items.map((item, i) => {
                        return (
                            <ListGroupItem key={props.title + "-item-" + i}>
                                {item.name}{item.desc !== "" && (
                                <>
                                    : {item.desc}
                                </>
                            )}
                            </ListGroupItem>
                        );
                    })}
                </ListGroup>
            </div>
        </div>
    );
}

export {
    PersonaInfoItem
}