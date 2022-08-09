import {Component} from "react";
import {RouteComponentProps, StaticContext} from "react-router";
import {Session} from "../../../../general-components/Session/Session";
import {
    acceptContribution,
    declineContribution,
    showContribution
} from "../../../../general-components/API/calls/Contribution";
import {showErrorPage} from "../../../../index";
import {Loader} from "../../../../general-components/Loader/Loader";
import {SaveResource, SharedSaveResource} from "../../../../general-components/Datastructures";
import {LoadingButton} from "../../../../general-components/LoadingButton/LoadingButton";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons/";


import "./contribution-decision.scss";


interface ContributionDecisionState {
    sharedSave: SharedSaveResource | null,
    save: SaveResource<any> | null,
    isAccepting: boolean,
    isDeclining: boolean,
    accepted?: boolean,
    declined?: boolean
}


export class ContributionDecision extends Component<RouteComponentProps<{ sharedSaveID: string }>, ContributionDecisionState> {

    constructor(props: RouteComponentProps<{ sharedSaveID: string; }, StaticContext, unknown> | Readonly<RouteComponentProps<{ sharedSaveID: string; }, StaticContext, unknown>>) {
        super(props);

        this.state = {
            sharedSave: null,
            save: null,
            isAccepting: false,
            isDeclining: false,
            accepted: undefined,
            declined: undefined
        }
    }

    checkParam = async () => {
        let saveID = this.props.match.params.sharedSaveID;
        let call = await showContribution(parseInt(saveID));

        if (
            call?.success &&
            call.callData.data.user === Session.currentUser?.getID() &&
            !call.callData.data.declined &&
            !call.callData.data.revoked &&
            !call.callData.data.accepted
        ) {
            this.setState({
                sharedSave: call.callData.data
            });
            await this.checkForAccept();
        } else {
            showErrorPage(403);
        }
    }

    render() {
        return (
            <Loader transparent payload={[this.checkParam]}>
                <div className={"contribution-decision"}>
                    <h2>Einladung annehmen</h2>

                    {(!this.state.accepted && !this.state.declined) && (
                        <>
                            <p>Sie wurden Eingeladen, an einem Speicherstand mitzuwirken.</p>

                            <LoadingButton
                                onClick={() => this.acceptInvitation()}
                                defaultChild={"Annehmen"}
                                isSaving={this.state.isAccepting}
                                defaultIcon={faCheck}
                                savingChild={"Annehmen"}
                            />
                            <LoadingButton
                                onClick={() => this.declineInvitation()}
                                variant={"danger"}
                                defaultChild={"Ablehnen"}
                                defaultIcon={faTimes}
                                isSaving={this.state.isDeclining}
                                savingChild={"Ablehnen"}
                            />
                        </>
                    )}

                    <div className={"feedbackContainer"}>
                        {(this.state.accepted !== undefined) && (
                            this.state.accepted ? (
                                <div className={"feedback SUCCESS"}>
                                    Einladung erfolgreich angenommen!
                                </div>
                            ) : (
                                <div className={"feedback DANGER"}>
                                    Einladung annehmen fehlgeschlagen! Versuchen Sie es später erneut.
                                </div>
                            )
                        )}
                        {(this.state.declined !== undefined) && (
                            this.state.declined ? (
                                <div className={"feedback SUCCESS"}>
                                    Einladung erfolgreich abgelehnt!
                                </div>
                            ) : (
                                <div className={"feedback DANGER"}>
                                    Einladung ablehnen fehlgeschlagen! Versuchen Sie es später erneut.
                                </div>
                            )
                        )}
                    </div>
                </div>
            </Loader>
        );
    }

    private checkForAccept = async () => {
        const queryString = window.location.search;
        const urlParams = new URLSearchParams(queryString);
        if (urlParams.has("accepted")) {
            let accepted = urlParams.get("accepted");
            if (accepted === "true") {
                await this.acceptInvitation();
            } else if (accepted === "false") {
                await this.declineInvitation();
            }
        }
    }

    private acceptInvitation = async () => {
        this.setState({
            isAccepting: true
        });

        let saveID = this.props.match.params.sharedSaveID;
        let call = await acceptContribution(parseInt(saveID));

        this.setState({
            isAccepting: false,
            accepted: call?.success
        });
    }

    private declineInvitation = async () => {
        this.setState({
            isDeclining: true
        });

        let saveID = this.props.match.params.sharedSaveID;
        let call = await declineContribution(parseInt(saveID));

        this.setState({
            isDeclining: false,
            declined: call?.success
        });
    }

}