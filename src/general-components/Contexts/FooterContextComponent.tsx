import {ControlFooterItemType} from "../ControlFooter/ControlFooter";
import React, {Component, ReactNode} from "react";


export interface IFooterContext {
    items: Map<number, ControlFooterItemType>,
    setItem: (place: number, item: ControlFooterItemType) => void,
    removeItem: (place: number) => void,
    disableItem: (place: number, disable: boolean) => void,
    clearItems: () => void
}


export interface FooterContextState {
    footerContext: IFooterContext;
}

export interface FooterContextProps {
    children: ReactNode
}

const DefaultContext: IFooterContext = {
    items: new Map(),
    setItem: () => {
    },
    removeItem: () => {
    },
    clearItems: () => {
    },
    disableItem: () => {
    }
};
export const FooterContext = React.createContext<IFooterContext>(DefaultContext);

export class FooterContextComponent extends Component<FooterContextProps, FooterContextState> {

    constructor(props: Readonly<FooterContextProps> | FooterContextProps);
    constructor(props: FooterContextProps, context: any);
    constructor(props: FooterContextProps | Readonly<FooterContextProps>, context?: any) {
        super(props, context);
        this.state = {
            footerContext: this.buildContext(new Map())
        };
    }

    componentDidMount() {
//         let oldMap = this.state.items;
//
//         if (ControlFooterComponent.oldItems) {
//             oldMap = ControlFooterComponent.oldItems;
//         } else {
//             for (let i = 1; i <= this.props.places; i++) {
//                 oldMap.set(i, null);
//             }
//             ControlFooterComponent.oldItems = oldMap;
//         }
//         this.setState({
//             items: oldMap
//         });
    }

    /**
     * Will fix the "Can't perform a React state update on an unmounted component" error. Doing this will replace the setState function so it will just return nothing.
     * This is considered pretty hacky, but using history.push from react-router, this could be considered a considerable solution
     */
    componentWillUnmount() {
        this.setState = (() => {
            return;
        });
    }

    render() {
        return (
            <FooterContext.Provider value={this.state.footerContext}>
                {this.props.children}
            </FooterContext.Provider>
        );
    }

    private setItem = (place: number, item: ControlFooterItemType) => {
        this.setState(state => {
            const items = state.footerContext.items.set(place, item);

            return {
                footerContext: this.buildContext(items)
            }
        });
    }

    private disableItem = (place: number, disabled: boolean) => {
        if (this.state.footerContext.items.has(place)) {
            this.setState(state => {
                const items = state.footerContext.items;
                const item = items.get(place);
                if (item) {
                    item.disabled = disabled;
                }

                return {
                    footerContext: this.buildContext(items)
                }
            });
        }
    }

    private removeItem = () => {

    }

    private clear = () => {
        this.setState({
            footerContext: this.buildContext(new Map<number, ControlFooterItemType>())
        });
    }

    private buildContext(items: Map<number, ControlFooterItemType>): IFooterContext {
        return {
            items: items,
            setItem: this.setItem,
            disableItem: this.disableItem,
            clearItems: this.clear,
            removeItem: this.removeItem
        }
    }
}
