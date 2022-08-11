import {Component} from "react";
import {Table} from "react-bootstrap";
import {SharedSaveResource} from "../Datastructures";


import "./collabortors-component.scss"


export interface CollaboratorsProps {
    collaborators: SharedSaveResource[]
}

class CollaboratorsComponent extends Component<CollaboratorsProps, any> {

    public static permissionSwitch(permission: number): string {
        switch (permission) {
            case 0:
                return "Nur Lesen";
            case 1:
                return "Lesen & Schreiben";
            case 2:
                return "Admin";
            default:
                return "";
        }
    }

    render() {
        return (
            <>
                <Table className={"collaborators-table"}>
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
                                <td>{CollaboratorsComponent.permissionSwitch(value.permission)}</td>
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