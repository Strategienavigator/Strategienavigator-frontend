import {createContext, PureComponent} from "react";
import {SharedSavePermission} from "../Datastructures";


/**
 * Interface des SharedSaveContext
 */
export interface ISharedSaveContext {
    permission: SharedSavePermission
}

/**
 * Der SharedSaveContext
 * @type {React.Context<ISharedSaveContext>}
 */
export const SharedSaveContext = createContext<ISharedSaveContext>({
    permission: SharedSavePermission.OWNER
});

/**
 * Interface für den SharedSaveState
 */
export interface SharedSaveState {
}

/**
 * Interface für die Props des SharedSaveContextComponent
 */
export interface SharedSaveContextComponentProps {
    permission: SharedSavePermission
}

/**
 * SharedSaveContextComponent
 */
class SharedSaveContextComponent extends PureComponent<SharedSaveContextComponentProps, SharedSaveState> {




    render() {
        return (
            <SharedSaveContext.Provider value={{permission: this.props.permission}}>
                {this.props.children}
            </SharedSaveContext.Provider>
        );
    }

}

export {
    SharedSaveContextComponent
}
