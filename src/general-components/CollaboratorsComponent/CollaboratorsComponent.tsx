import {Component} from "react";
import {Table} from "react-bootstrap";
import {SharedSaveResource} from "../Datastructures";
import {getSharedSavePermissionText} from "../Save";

import "./collabortors-component.scss"


export interface CollaboratorsProps {
    collaborators: SharedSaveResource[]
}

class CollaboratorsComponent extends Component<CollaboratorsProps, any> {

    render() {
        if (this.props.collaborators.length <= 0) {
            return (
                <span>
                    Keine Kollaboratoren vorhanden...
                </span>
            );
        }

        return (
            <>
                <Table variant={"dark"} hover bordered className={"collaborators-table"}>
                    <thead>
                    <tr>
                        <th>Username</th>
                        <th>Berechtigung</th>
                    </tr>
                    </thead>
                    <tbody>
                    {this.props.collaborators.filter((value) => {
                        return value.accepted;
                    }).map((value) => {
                        return (
                            <tr key={`collaboration-component-tr-${value.id}`}>
                                <td>{value.user.username}</td>
                                <td>{getSharedSavePermissionText(value.permission)}</td>
                            </tr>
                        );
                    })}
                    </tbody>
                </Table>
            </>
        );
    }

}

export {
    CollaboratorsComponent
}