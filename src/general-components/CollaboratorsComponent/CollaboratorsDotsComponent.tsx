import "./collaborators-dots-component.scss";
import {Component} from "react";
import {SimplestUserResource} from "../Datastructures";
import {OverlayTrigger, Tooltip} from "react-bootstrap";
import {Session} from "../Session/Session";


export interface CollaboratorsDotsComponentProps {
    collaborators: SimplestUserResource[]
}

export class CollaboratorsDotsComponent extends Component<CollaboratorsDotsComponentProps, any> {
    alpha = 0.45;
    colors = [
        `rgba(255, 0, 0, ${this.alpha})`, // red
        `rgba(0, 255, 0, ${this.alpha})`, // lime
        `rgba(255, 0, 255, ${this.alpha})`, // fuchsia
        `rgba(255, 215, 0, ${this.alpha})`, // gold
        `rgba(0, 100, 0, ${this.alpha})`, // darkgreen
        `rgba(255, 228, 196, ${this.alpha})`, // bisque
        `rgba(0, 0, 128, ${this.alpha})`, // navy
        `rgba(0, 191, 255, ${this.alpha})` // deepskyblue
    ];

    render = () => {
        return (
            <div className={"collaborators dots"}>
                {(this.props.collaborators.map((user, index) => {
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
                                style={{backgroundColor: this.getColor(user.id)}}
                            >
                                {letter}
                            </div>
                        </OverlayTrigger>
                    );
                }))}
            </div>
        );
    }

    private getColor(index: number) {
        return this.colors[index % this.colors.length];
    }

}