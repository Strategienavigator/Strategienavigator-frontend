import {Component} from "react";
import {RouteComponentProps, StaticContext} from "react-router";
import {Session} from "../../../../general-components/Session/Session";
import {
    acceptContribution,
    declineContribution,
    showContributions
} from "../../../../general-components/API/calls/Contribution";
import {Loader} from "../../../../general-components/Loader/Loader";
import {SaveResource, SharedSaveResource} from "../../../../general-components/Datastructures";
import {LoadingButton} from "../../../../general-components/LoadingButton/LoadingButton";
import {faCheck, faTimes} from "@fortawesome/free-solid-svg-icons/";


import "./contribution-decision.scss";
import {Messages} from "../../../../general-components/Messages/Messages";
import {getSaveURL, getSharedSavePermissionText} from "../../../../general-components/Save";
import {legacyShowErrorPage} from "../../../../general-components/LegacyErrorPageAdapter";


interface ContributionDecisionState {
    sharedSave: SharedSaveResource | null,
    save: SaveResource<any> | null,
    isAccepting: boolean,
    isDeclining: boolean,
    accepted?: boolean,
    declined?: boolean
}


export class ContributionDecision extends Component<RouteComponentProps<{
    sharedSaveID: string
}>, ContributionDecisionState> {

    constructor(props: RouteComponentProps<{
        sharedSaveID: string;
    }, StaticContext, unknown> | Readonly<RouteComponentProps<{ sharedSaveID: string; }, StaticContext, unknown>>) {
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
        let saveID = parseInt(this.props.match.params.sharedSaveID);
        let userID = Session.currentUser?.getID() as number;
        let call = await showContributions(userID);

        if (
            call && call.success
        ) {
            let i = 0;
            let data = call.callData.data;
            let foundSave = undefined;
            while (i < data.length && foundSave === undefined) {
                let save = data[i];
                if (
                    save.user.id === userID &&
                    save.id === saveID &&
                    !save.accepted &&
                    !save.declined &&
                    !save.revoked
                ) {
                    foundSave = data[i];
                }
                i++;
            }

            if (foundSave) {
                this.setState({
                    sharedSave: foundSave
                });
                await this.checkForAccept();
                return;
            }
        }
        legacyShowErrorPage(403)
    }

    render() {
        return (
            <Loader transparent payload={[this.checkParam]}>
                <div className={"contribution-decision"}>
                    <h2>Einladung zu <b>{this.state.sharedSave?.save.name}</b></h2>

                    {(!this.state.accepted && !this.state.declined) && (
                        <>
                            <p>
                                Sie wurden Eingeladen an dem
                                Speicherstand <b>{this.state.sharedSave?.save.name}</b> von <b>{this.state.sharedSave?.save.owner.username}</b> mitzuwirken.<br/>
                            </p>

                            <p>
                                Sie werden folgende Berechtigung erhalten: <br/>
                                <b>{getSharedSavePermissionText(this.state.sharedSave?.permission as number)}</b>
                            </p>

                            <p>
                                Möchten Sie diese Einladung annehmen?
                            </p>

                            <LoadingButton
                                onClick={() => this.acceptInvitation()}
                                defaultChild={"Annehmen"}
                                isLoading={this.state.isAccepting}
                                defaultIcon={faCheck}
                                savingChild={"Annehmen"}
                            />
                            <LoadingButton
                                onClick={() => this.declineInvitation()}
                                variant={"danger"}
                                defaultChild={"Ablehnen"}
                                defaultIcon={faTimes}
                                isLoading={this.state.isDeclining}
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

        if (call && call.success) {
            Messages.add("Einladung angenommen!", "SUCCESS", 5000);
            this.props.history.push(getSaveURL(this.state.sharedSave?.save.id as number, this.state.sharedSave?.save.tool.id as number));
        } else {
            this.setState({
                isAccepting: false,
                accepted: call?.success
            });
        }
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
