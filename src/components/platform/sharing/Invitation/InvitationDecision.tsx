import {Component} from "react";
import {RouteComponentProps, StaticContext} from "react-router";


import "./invitation-decision.scss";
import {acceptInvitationLink, showInvitationLink} from "../../../../general-components/API/calls/Invitations";
import {InvitationLinkResource} from "../../../../general-components/Datastructures";
import {Loader} from "../../../../general-components/Loader/Loader";
import {LoadingButton} from "../../../../general-components/LoadingButton/LoadingButton";
import {MessageContext} from "../../../../general-components/Messages/Messages";
import {getSaveURL, getSharedSavePermissionText} from "../../../../general-components/Save";


export interface InvitationDecisionState {
    link: InvitationLinkResource | null,
    isSaving: boolean
}

export class InvitationDecision extends Component<RouteComponentProps<{ token: string }>, InvitationDecisionState> {


    /**
     * Definiert auf welchen Context zugegriffen werden soll
     */
    static contextType = MessageContext;
    context!: React.ContextType<typeof MessageContext>
    constructor(props: RouteComponentProps<{ token: string; }, StaticContext, unknown> | Readonly<RouteComponentProps<{
        token: string;
    }, StaticContext, unknown>>) {
        super(props);

        this.state = {
            link: null,
            isSaving: false
        };
    }

    getSave = async () => {
        let invitation = await showInvitationLink(this.props.match.params.token);

        if (!invitation?.success) {
            this.props.history.push("/");
        } else {
            this.setState({
                link: invitation.callData.data
            });
        }
    }

    render() {
        return (
            <Loader
                payload={[this.getSave]}
                transparent={true}
            >
                <div className={"invitation-decision"}>
                    <h2>Einladung zu <b>{this.state.link?.save.name}</b>!</h2>

                    <p>
                        Sie haben eine Einladung zu dem
                        Speicherstand <b>{this.state.link?.save.name}</b> von <b>{this.state.link?.save.owner.username}</b> erhalten.<br/>
                    </p>

                    <p>
                        Sie werden folgende Berechtigung erhalten: <br/>
                        <b>{getSharedSavePermissionText(this.state.link?.permission as number)}</b>
                    </p>

                    <p>
                        Möchten Sie diese Einladung annehmen?
                    </p>

                    <LoadingButton
                        showIcons={false}
                        className={"accept"}
                        savingChild={"Annehmen"}
                        isLoading={this.state.isSaving}
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
            this.context.add("Einladung angenommen!", "SUCCESS", 5000);
            this.props.history.push(getSaveURL(this.state.link?.save.id as number, this.state.link?.save.tool.id as number));
        }
    }

}

