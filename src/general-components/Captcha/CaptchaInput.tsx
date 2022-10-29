import {PureComponent} from "react";
import {Form} from "react-bootstrap";


interface CaptchaInputProps {
    label: string,
    captchaName: string
}


class CaptchaInput extends PureComponent<CaptchaInputProps, {}> {

    static defaultProps = {
        label: "Captcha",
        captchaName: "captcha"
    }

    render() {
        return (
            <Form.Floating>
                <Form.Control id={this.props.captchaName} name={this.props.captchaName} size={"sm"} required={true}
                              type={"text"} placeholder={this.props.label}/>
                <Form.Label htmlFor={this.props.captchaName}>{this.props.label}</Form.Label>
            </Form.Floating>
        );
    }

}

export {
    CaptchaInput
}
