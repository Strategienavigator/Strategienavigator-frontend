import React, {Component} from "react";
import {ErrorMap, UIError} from "../../Error/UIErrors/UIError";
import produce from "immer";
import {WritableDraft} from "immer/dist/types/types-external";


interface IUIErrorContext extends ErrorController {
    errors: ErrorMap
}

interface UIErrorContextState {
    uiErrorContext: IUIErrorContext;
}

/**
 * Funktionen zum Verwalten von Errors.
 *
 * Ids können punkt separiert angegeben werden. Zum Beispiel "tool.name"
 * Beim Abrufen durch hasError und getErrors kann dann nur "tool" angegeben werden und alle Error die mit "tool." angelegt wurden, werden mit berücksichtigt
 */
interface ErrorController {
    /**
     * Fügt einen Error hinzu
     * @param errors {UIError[]}
     */
    putErrors: (errors: UIError[]) => void
    /**
     * Entfernt den Error mit genau dem fehler
     * @param id
     */
    removeError: (id: string) => void

    /**
     * Entfernt alle Errors die entweder die gegebene oder eine tochter id besitzen
     *
     * Zum Beispiel würde "tool" all errors wessen id mit "tool." beginnen entfernen
     * @param id
     */
    removeErrors: (id: string) => void

    /**
     * entfernt alle Fehler
     */
    clearErrors: () => void
}

const UIErrorContext = React.createContext<IUIErrorContext>({
    putErrors: () => {
    },
    removeError: () => {
    },
    removeErrors: () => {
    },
    clearErrors: () => {

    },
    errors: {}
});


const withUIErrorContext = <P extends object>(Component: React.ComponentType<P & { uiErrorContext: IUIErrorContext }>) =>
    class WithLoading extends React.Component<P> {
        render() {
            return (
                <UIErrorContext.Consumer>
                    {errorContext =>
                        <Component {...this.props} uiErrorContext={errorContext}/>
                    }
                </UIErrorContext.Consumer>
            )

        }
    };

class UIErrorContextComponent extends Component<{}, UIErrorContextState> implements ErrorController {


    constructor(props: Readonly<{}> | {});
    constructor(props: {}, context: any);
    constructor(props: Readonly<{}> | {}, context?: any) {
        super(props, context);
        this.state = {
            uiErrorContext: this.buildContext()
        }
    }

    render() {
        return (
            <UIErrorContext.Provider value={this.state.uiErrorContext}>
                {this.props.children}
            </UIErrorContext.Provider>
        );
    }

    putErrors = (error: UIError[]): void => {
        this.updateErrors((draft) => {
            error.forEach((e) => draft[e.id] = e);
        });

    };

    removeError = (id: string): void => {
        this.updateErrors(draft => {
            delete draft[id];
        });
    };

    removeErrors = (id: string): void => {
        const [idWithDot, pureId] =
            id.endsWith(".") ?
                [id, id.substr(0, id.length - 1)]
                :
                [id.substr(0, id.length - 1), id];

        this.updateErrors(draft => {
            for (const draftKey in draft) {
                if (draftKey.startsWith(idWithDot) || pureId === draftKey) {
                    delete draft[draftKey];
                }
            }
        });
    };

    clearErrors = (): void => {
        this.updateErrors(draft => {
            return {};
        });
    };

    private buildContext = (errors: ErrorMap = {}): IUIErrorContext => {
        return {
            putErrors: this.putErrors,
            removeError: this.removeError,
            removeErrors: this.removeErrors,
            clearErrors: this.clearErrors,
            errors: errors,
        }

    }

    private updateErrors = (cb: (draft: WritableDraft<ErrorMap>) => ErrorMap | void) => {
        this.setState((oldState) => {
            return {
                uiErrorContext: this.buildContext(produce(oldState.uiErrorContext.errors, cb))
            }
        });
    }
}

export
    type {
    IUIErrorContext
    ,
    ErrorController
}

export {
    UIErrorContext,
    UIErrorContextComponent,
    withUIErrorContext
}
