import {createContext, PureComponent, ReactNode} from "react";
import {SharedSavePermission, SharedSavePermissionDefault} from "../Datastructures";


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
    permission: SharedSavePermissionDefault
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
    permission?: SharedSavePermission,
    children: ReactNode
}

/**
 * SharedSaveContextComponent
 */
class SharedSaveContextComponent extends PureComponent<SharedSaveContextComponentProps, SharedSaveState> {

    render() {
        let permission = this.props.permission ?? SharedSavePermissionDefault;
        return (
            <SharedSaveContext.Provider value={{permission: permission}}>
                {this.props.children}
            </SharedSaveContext.Provider>
        );
    }

}

export {
    SharedSaveContextComponent
}
