import {Component, ReactElement} from "react";
import {RouteComponentProps, StaticContext} from "react-router";
import {Forbidden} from "./forbidden/Fordidden";

import "./error-pages.scss";
import {Link} from "react-router-dom";
import {NotFound} from "./not-found/NotFound";
import {APINotReachable} from "./api-not-reachable/APINotReachable";
import {Button} from "react-bootstrap";
import {faHome, faRedo} from "@fortawesome/free-solid-svg-icons/";
import {ErrorPage} from "./errorpage/ErrorPage";
import FAE from "../../Icons/FAE";


export type ErrorComponentTypes =
    ReactElement<Forbidden>
    | ReactElement<NotFound>
    | ReactElement<ErrorPage>
    | ReactElement<APINotReachable>;

class ErrorPages extends Component<RouteComponentProps<{ code: string }>, any> {
    private code: number;

    constructor(props: RouteComponentProps<{ code: string; }, StaticContext, unknown> | Readonly<RouteComponentProps<{
        code: string;
    }, StaticContext, unknown>>) {
        super(props);
        this.code = parseInt(this.props.match.params.code);
    }

    getErrorComponent = (): ErrorComponentTypes | undefined => {
        if (this.code === 500) {
            return <APINotReachable/>;
        } else if (this.code === 404) {
            return <NotFound/>;
        } else if (this.code === 403) {
            return <Forbidden/>;
        }
        this.code = 404;
        return <NotFound/>;
    }

    render() {
        let component = this.getErrorComponent();

        return (
            <div className={"errorpage"}>
                <h1 className={"header"}>Fehler <b>{this.code}</b></h1>

                <div className={"error"}>
                    {component}
                </div>

                {(this.code === 500) && (
                    <Button className="button" style={{marginRight: "0.75rem"}} onClick={this.props.history.goBack}
                            variant={"dark"}>
                        Erneut versuchen &nbsp;
                        <FAE icon={faRedo}/>
                    </Button>
                )}

                <Link to="/">
                    <Button className="button" variant={"dark"}>
                        Startseite &nbsp;
                        <FAE icon={faHome}/>
                    </Button>
                </Link>
            </div>
        );
    }

}

export {
    ErrorPages
}
