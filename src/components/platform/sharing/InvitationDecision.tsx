import {Component} from "react";
import {RouteComponentProps, StaticContext} from "react-router";


import "./invitation-decision.scss";
import {createContribution} from "../../../general-components/API/calls/Contribution";
import {
    acceptInvitationLink,
    createInvitationLink,
    deleteInvitationLink,
    showInvitationLink
} from "../../../general-components/API/calls/Invitations";
import {getSave} from "../../../general-components/API/calls/Saves";
import {SaveResource} from "../../../general-components/Datastructures";
import {CallInterface} from "../../../general-components/API/API";
import {Loader} from "../../../general-components/Loader/Loader";
import {LoadingButton} from "../../../general-components/LoadingButton/LoadingButton";
import FAE from "../../../general-components/Icons/FAE";
import {faCheckCircle} from "@fortawesome/free-solid-svg-icons";


type DecisionType = true | false | null;

export interface InvitationDecisionState {
    decision: DecisionType,
    save: SaveResource | null,
    isSaving: boolean
}

export class InvitationDecision extends Component<RouteComponentProps<{ token: string }>, InvitationDecisionState> {

    constructor(props: RouteComponentProps<{ token: string; }, StaticContext, unknown> | Readonly<RouteComponentProps<{ token: string; }, StaticContext, unknown>>) {
        super(props);

        this.state = {
            decision: null,
            save: null,
            isSaving: false
        };
    }

    createLink = async () => {
        console.log(await createContribution(45, 2, {
            permission: 2
        }));
        console.log(await createInvitationLink({
            permission: 2,
            expiry_date: new Date("2023-01-01"),
            save_id: 45
        }));
    }

    getSave = async () => {
        //await this.createLink();

        // TODO: Aktuell wird nur mit ID nicht mit Token abgefragt
        let invitation = await showInvitationLink(this.props.match.params.token);

        if (!invitation?.success) {
            this.props.history.push("/");
        } else {
            let saveID = invitation.callData.data.save_id;
            let save: CallInterface<SaveResource<any>> | null = await getSave(saveID);

            if (save && save.success) {
                this.setState({
                    decision: null,
                    save: save.callData
                });
            } else {
                this.props.history.push("/");
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

                    {(this.state.decision === null) ? (
                        this.defaultRender()
                    ) : this.state.decision && (
                        this.acceptedRender()
                    )}
                </div>
            </Loader>
        );
    }

    invitationDecision = async (decision: boolean) => {
        this.setState({
            decision: null,
            isSaving: true,
            save: this.state.save
        });

        let token = this.props.match.params.token;
        (decision) ? await acceptInvitationLink(token) : await deleteInvitationLink(token);

        this.setState({
            decision: decision,
            save: this.state.save,
            isSaving: false
        });
    }

    defaultRender() {
        return (
            <>
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
                    onClick={() => this.invitationDecision(true)}
                />
            </>
        );
    }

    acceptedRender() {
        return (
            <p><FAE className={"text-success"} icon={faCheckCircle}/> Sie haben die Einladung angenommen.</p>
        )
    }

}

