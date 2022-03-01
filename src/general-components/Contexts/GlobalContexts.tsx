import {Component} from "react";
import {SettingsContextComponent} from "./SettingsContextComponent";
import {FooterContextComponent} from "./FooterContextComponent";


export class GlobalContexts extends Component<any, any> {

    constructor(props: Readonly<{}> | {});
    constructor(props: {}, context: any);
    constructor(props: Readonly<{}> | {}, context?: any) {
        super(props, context);
    }

    render() {
        return (
            <SettingsContextComponent>
                <FooterContextComponent>
                    {this.props.children}
                </FooterContextComponent>
            </SettingsContextComponent>
        );
    }
}
