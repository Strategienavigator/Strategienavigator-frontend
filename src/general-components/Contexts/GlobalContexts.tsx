import {Component} from "react";
import {SettingsContextComponent} from "./SettingsContextComponent";
import {FooterContextComponent} from "./FooterContextComponent";
import {UserContextComponent} from "./UserContextComponent";


export class GlobalContexts extends Component<any, any> {

    public constructor(props: Readonly<{}> | {});
    public constructor(props: {}, context: any);
    public constructor(props: Readonly<{}> | {}, context?: any) {
        super(props, context);
    }

    render() {
        return (
            <UserContextComponent>
                <SettingsContextComponent>
                    <FooterContextComponent>

                        {this.props.children}

                    </FooterContextComponent>
                </SettingsContextComponent>
            </UserContextComponent>
        );
    }
}
