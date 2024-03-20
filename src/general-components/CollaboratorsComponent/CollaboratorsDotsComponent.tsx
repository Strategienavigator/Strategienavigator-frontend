import "./collaborators-dots-component.scss";
import {SimplestUserResource} from "../Datastructures";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {Session} from "../Session/Session";


const alpha = 0.45;
const colors = [
    `rgba(255, 0, 0, ${alpha})`, // red
    `rgba(0, 255, 0, ${alpha})`, // lime
    `rgba(255, 0, 255, ${alpha})`, // fuchsia
    `rgba(255, 215, 0, ${alpha})`, // gold
    `rgba(0, 100, 0, ${alpha})`, // darkgreen
    `rgba(255, 228, 196, ${alpha})`, // bisque
    `rgba(0, 0, 128, ${alpha})`, // navy
    `rgba(0, 191, 255, ${alpha})` // deepskyblue
];

function getColor(index: number) {
    return colors[index % colors.length];
}

export interface CollaboratorsDotsComponentProps {
    collaborators: SimplestUserResource[]
}

export function CollaboratorsDotsComponent({collaborators}:CollaboratorsDotsComponentProps) {
        return (
            <div className={"collaborators dots"}>
                {(collaborators.map((user, index) => {
                    let letter = user.username.substr(0, 1).toUpperCase();
                    return (
                        <OverlayTrigger
                            key={`collaborator-${index}-${user.id}-${user.username}`}
                            trigger={["hover", "focus", "click"]}
                            placement={"top"}
                            overlay={
                                <Tooltip>
                                    {user.username} {(user.id === Session.currentUser?.getID()) && "(Sie)"}
                                </Tooltip>
                            }
                        >
                            <div
                                className={"collaborator"}
                                style={{backgroundColor: getColor(user.id)}}
                            >
                                {letter}
                            </div>
                        </OverlayTrigger>
                    );
                }))}
            </div>
        );
    }


