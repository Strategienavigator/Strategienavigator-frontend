import {PureComponent} from "react";
import {UIErrorContext} from "../../../Contexts/UIErrorContext/UIErrorContext";
import {Alert} from "react-bootstrap";


interface UIErrorBannerProps {
    /**
     * id of the error
     */
    id: string
    box: boolean
}


class UIErrorBanner extends PureComponent<UIErrorBannerProps, {}> {

    static defaultProps = {
        box: false
    }

    render() {
        return (
            <UIErrorContext.Consumer>
                {errorContext => {
                    if (this.props.id in errorContext.errors) {
                        const error = errorContext.errors[this.props.id];
                        if (this.props.box) {
                            return (
                                <Alert
                                    variant={error.level === "error" ? "danger" : error.level}>{error.message}</Alert>
                            )
                        } else {
                            return (
                                <div>{error.message}</div>
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
