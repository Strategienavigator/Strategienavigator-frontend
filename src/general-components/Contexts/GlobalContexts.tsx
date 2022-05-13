import {Component} from "react";
import {SettingsContextComponent} from "./SettingsContextComponent";
import {FooterContextComponent} from "./FooterContextComponent";


export class GlobalContexts extends Component<any, any> {

    public constructor(props: Readonly<{}> | {});
    public constructor(props: {}, context: any);
    public constructor(props: Readonly<{}> | {}, context?: any) {
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
