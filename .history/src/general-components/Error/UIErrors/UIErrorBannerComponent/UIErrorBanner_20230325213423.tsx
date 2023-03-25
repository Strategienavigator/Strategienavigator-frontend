import {PureComponent} from "react";
import {UIErrorContext} from "../../../Contexts/UIErrorContext/UIErrorContext";
import {Alert} from "react-bootstrap";


interface UIErrorBannerProps {
    /**
     * id of the error
     */
    id: string
    box: boolean
    disabled: boolean
}


class UIErrorBanner extends PureComponent<UIErrorBannerProps, {}> {

    static defaultProps = {
        box: false,
        disabled: false
    }

    render() {
        return (
            <UIErrorContext.Consumer>
                {errorContext => {
                    if ((!this.props.disabled) && this.props.id in errorContext.errors) {
                        const error = errorContext.errors[this.props.id];
                        if (this.props.box) {
                            return (
                                <Alert
                                    variant={error.level === "error" ? "danger" : error.level}>{error.message}</Alert>
                            )
                        } else {
                            return (
                                <div className={"feedbackContainer"}>

                                    <div key={"feedback-" + error.id} className={"feedback DANGER"}>
                                        {error.message}
                                    </div>
                                </div>
                            )
                        }

                    }
                    return undefined;
                }}
            </UIErrorContext.Consumer>
        );
    }
}

export {
    UIErrorBanner
}
