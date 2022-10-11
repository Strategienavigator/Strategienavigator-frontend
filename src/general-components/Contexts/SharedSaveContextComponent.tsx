import {Component, createContext} from "react";
import {SharedSavePermission, SimpleSaveResource} from "../Datastructures";
import {Session} from "../Session/Session";


/**
 * Interface des SharedSaveContext
 */
export interface ISharedSaveContext {
    permission: SharedSavePermission,
    updatePermission: (newPermission: SharedSavePermission) => void
}

/**
 * Der SharedSaveContext
 * @type {React.Context<ISharedSaveContext>}
 */
export const SharedSaveContext = createContext<ISharedSaveContext>({
    permission: SharedSavePermission.OWNER,
    updatePermission: () => {
    }
});

/**
 * Interface für den SharedSaveState
 */
export interface SharedSaveState {
    sharedSaveContext: ISharedSaveContext
}

/**
 * Interface für die Props des SharedSaveContextComponent
 */
export interface SharedSaveContextComponentProps {
    save: SimpleSaveResource // TODO: change to SharedSaveRessource only
}

/**
 * SharedSaveContextComponent
 */
class SharedSaveContextComponent extends Component<SharedSaveContextComponentProps, SharedSaveState> {

    constructor(props: SharedSaveContextComponentProps | Readonly<SharedSaveContextComponentProps>) {
        super(props);

        this.state = {
            sharedSaveContext: {
                permission: SharedSavePermission.OWNER,
                updatePermission: this.updatePermission
            }
        }
    }

    static getDerivedStateFromProps(props: SharedSaveContextComponentProps, state: SharedSaveState) {
        return {
            sharedSaveContext: {
                permission: (props.save && props.save.permission) ? props.save.permission.permission : (
                    props.save && props.save.owner.id === Session.currentUser?.getID()
                ) ? SharedSavePermission.OWNER : SharedSavePermission.READ,
                updatePermission: state.sharedSaveContext.updatePermission
            }
        };
    }

    render() {
        return (
            <SharedSaveContext.Provider value={this.state.sharedSaveContext}>
                {this.props.children}
            </SharedSaveContext.Provider>
        );
    }

    private updatePermission = (newPermission: SharedSavePermission) => {
        this.setState({
            sharedSaveContext: {
                permission: newPermission,
                updatePermission: this.updatePermission
            }
        });
    }

}

export {
    SharedSaveContextComponent
}