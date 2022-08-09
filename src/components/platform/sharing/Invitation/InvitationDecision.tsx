import {Component} from "react";
import {RouteComponentProps, StaticContext} from "react-router";


import "./invitation-decision.scss";
import {acceptInvitationLink, showInvitationLink} from "../../../../general-components/API/calls/Invitations";
import {getSave} from "../../../../general-components/API/calls/Saves";
import {SaveResource} from "../../../../general-components/Datastructures";
import {CallInterface} from "../../../../general-components/API/API";
import {Loader} from "../../../../general-components/Loader/Loader";
import {LoadingButton} from "../../../../general-components/LoadingButton/LoadingButton";
import {Messages} from "../../../../general-components/Messages/Messages";


export interface InvitationDecisionState {
    save: SaveResource | null,
    isSaving: boolean
}

export class InvitationDecision extends Component<RouteComponentProps<{ token: string }>, InvitationDecisionState> {

    constructor(props: RouteComponentProps<{ token: string; }, StaticContext, unknown> | Readonly<RouteComponentProps<{ token: string; }, StaticContext, unknown>>) {
        super(props);

        this.state = {
            save: null,
            isSaving: false
        };
    }

    getSave = async () => {
        let invitation = await showInvitationLink(this.props.match.params.token);

        if (!invitation?.success) {
            this.props.history.push("/");
        } else {
            let saveID = invitation.callData.data.save_id;
            let save: CallInterface<SaveResource<any>> | null = await getSave(saveID);

            if (save && save.success) {
                this.setState({
                    save: save.callData
                });
            }
        }
    }

    render() {
        return (
            <Loader
                payload={[this.getSave]}
                transparent={true}
            >
                <div className={"invitation-decision"}>
                    <h2>Einladung von {this.state.save?.owner}!</h2>

                    <p>
                        Sie haben eine Einladung zu dem
                        Speicherstand <b>{this.state.save?.name}</b> von <b>{this.state.save?.owner}</b> erhalten.<br/>
                        Möchten Sie diese annehmen?
                    </p>

                    <LoadingButton
                        showIcons={false}
                        className={"accept"}
                        savingChild={"Annehmen"}
                        isSaving={this.state.isSaving}
                        defaultChild={"Annehmen"}
                        onClick={() => this.acceptInvitation()}
                    />
                </div>
            </Loader>
        );
    }

    acceptInvitation = async () => {
        let token = this.props.match.params.token;
        let response = await acceptInvitationLink(token);

        if (response?.success) {
            Messages.add("Einladung angenommen!", "SUCCESS", 5000);

            // TODO: backend integrieren maybe
            let loc = "";
            switch (this.state.save?.tool_id) {
                case 1:
                    loc += "/utility-analysis/";
                    break;
                case 2:
                    loc += "/swot-analysis/";
                    break;
                case 3:
                    loc += "/pairwise-comparison/";
                    break;
                case 4:
                    loc += "/portfolio-analysis/";
                    break;
                case 5:
                    loc += "/abc-analysis/";
                    break;
                default:
                    loc = "/";
                    break;
            }

            if (loc !== "/") {
                loc += this.state.save?.id;
            }

            this.props.history.push(loc);
        }
    }

}

