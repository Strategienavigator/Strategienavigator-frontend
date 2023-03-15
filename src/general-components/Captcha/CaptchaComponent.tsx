import {ChangeEvent, Component} from "react";
import {CallInterface} from "../API/API";
import {CaptchaResponse} from "../Datastructures";
import {getCaptcha} from "../API/calls/Captcha";
import {Form} from "react-bootstrap";

import './captcha-image.scss';

interface CaptchaComponentProps {
    /**
     * name des input elements des captcha keys
     */
    keyName: string

    /**
     * Label of input tag
     */
    label: string,

    /**
     * input tag name of the captcha
     */
    captchaName: string,

    /**
     * interval at which the image is refreshed in seconds
     */
    refreshIntervall: number

}

interface CaptchaComponentState {
    /**
     * Bilddaten des captchas oder fallback bild
     */
    img: string,
    /**
     * key des captcha
     */
    key?: string,
    /**
     * ob gerade ein captcha geladen wird
     */
    loading: boolean,
    /**
     * ob es beim Abrufen des captchas ein fehler gab
     */
    error: boolean

    /**
     * contents of input tag
     */
    captchaInput: string

}

class CaptchaComponent extends Component<CaptchaComponentProps, CaptchaComponentState> {

    private static fallbackImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAkCAYAAABCKP5eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAONSURBVHhe7ZpZqE1RGMcvMkamkEwRiUx5EBkikXmmpIhkKqJ4wAsJ5UmSQsmL6YVCiZKpUGYiSijzkHnM+P+f/X2se1r7nn1399bax/erX99aa+99Lvs7a+291jolhmEYhmEYhmEYFcpYeFhsxwYjPePEOrlacvrBpbBnrvaPaXBqVEzNDPhb7MEGIx3jod5IJqY8fIW87lyuFrEQ6udNYENKMp/gqhJDorz/Jj2/hkTyUyKpKbEyGAE5fB+EjdgQGsWQYPbQ1XBxrhaxHbIXz4J72FBJdIQj4WgYZIJDwR2iZ7IhEAoN0UugHm/PhtAohh6s1IUtYYNcrfxUgV2j4l/cYd9HbYnBEmKCq0lMQie4Cl6EH+BD+Aa+hifhMFgIDuU89zu8Dl/BA7A55JfGx2n4EvJvK7fgW/gE3ocDoCG4Q/Q8NiRgENRr1BeetkUwjo0w/3z1B9zr1N0h+h50z/U5GBqCm+AFbEgA5748/xCcDltBUh3y2fkN8vgD6GM21L95U+pt4FzIN2M9proJ5tx7KNwH9fh8yP8HTTJy/FekSTCH0LJ6yTKon+l7QboCeewx5NtwPtugXh/3GWugHueXIzhCfAYn5Sk8HhW98Lmq5L/hjoKasJ3wTlQsxRy4JSpmlywnuBDvJJImEhV3Xfm8RB+XJWaWYkkw31g5JK+DWyGfjZthHG0lklMS0/BLYrBkPcED4QnIJG2AyyGH1ilwCIxDezCnVu+jYir4ph00WU4wk3tEIqdH6+FE2Avy+ToZxqHDdz1YPyqmgnPnoMlygtlba8FnsC9cAffDC/AavA3jeCSR6PTKB9+Oy8J6cEIK3UgfulJ0FN6Nionh1EgZLtFHoU1+twfzyxYcWe3B/FGA3lCuIfvg4kcc7OkKf2Tgg7tTK6NiLJyqKWWNBP89vMm6YMCtvjGQPcunwl7L8zlM9maD0AzugPp5lKtM+eyGenwX7A5JB7gJutdT30JHf6jHuSfMzQ7C0SXtpkdR4ia4kLpoMQm67TfgWad+CXIaw7Ivwa2hrmap3CTQMp/TfLZr3Zdgwo0HPYd+lmjLlQ785j+Hn8SPHjmloS2gwiXOq9C9wXxDXgsJd3jY5kswaQzPQE2Kynk0HwENnba4BHeGx6B7/RfYBxoVBBcu+POZbrlaabhmnYQukJsI+WvK3DJMMpVqCjlly99TNgzDMAzDMAzDMEKhpOQPsXT9SnD6LfkAAAAASUVORK5CYII="

    static defaultProps = {
        keyName: "captcha_key",
        label: "Captcha",
        captchaName: "captcha",
        refreshIntervall: 60
    }
    private scheduler?: NodeJS.Timeout;

    constructor(props: Readonly<CaptchaComponentProps> | CaptchaComponentProps);
    constructor(props: CaptchaComponentProps, context: any);
    constructor(props: CaptchaComponentProps | Readonly<CaptchaComponentProps>, context?: any) {
        super(props, context);

        this.state = {
            img: CaptchaComponent.fallbackImage,
            key: undefined,
            loading: false,
            error: false,
            captchaInput: ""
        }
    }

    /**
     * Lädt ein Captcha vom Backend
     */
    private loadCaptcha = async () => {
        if (this.state.loading) {
            return;
        }
        this.setState({
            loading: true,
            error: false
        });

        let captchaData = await new Promise<CallInterface<CaptchaResponse> | null>((resolve, reject) => {
            getCaptcha({errorCallback: reject}).then(resolve).catch(reject)
        });

        if (captchaData && captchaData.success) {
            this.setState({
                img: captchaData.callData.img,
                key: captchaData.callData.key,
                loading: false,
                captchaInput: ""
            });
            this.scheduleRefresh();
        } else {
            this.setState({loading: false, error: true});
        }
    }

    private scheduleRefresh = () => {
        this.scheduler = setTimeout(this.loadCaptcha, this.props.refreshIntervall * 1000)
    }


    componentDidMount = () => {
        this.loadCaptcha().catch(console.error);
    }


    componentWillUnmount() {
        if (this.scheduler) {
            clearTimeout(this.scheduler)
        }
    }

    private onInputUpdate = (event: ChangeEvent<HTMLInputElement>) => {

        this.setState({
            captchaInput: event.target.value
        });
        event.preventDefault();
    }


    render() {

        let scrolling = !this.state.loading && !this.state.error
        return (
            <div className={"mt-2"}>
                <div className={"my-2 ms-1"}>
                    <div className={"image-container"}>
                        <img className={"border-dark border image"} src={this.state.img}
                             alt={"Captcha Bild, frage eine Person um Hilfe."}/>
                        <div style={{
                            animationDuration: this.props.refreshIntervall + "s"
                        }} className={"scrollbar" + (scrolling ? " scrolling-bar" : "")}>

                        </div>
                    </div>


                    <input
                        id={this.props.keyName}
                        type={"hidden"}
                        name={this.props.keyName}
                        value={this.state.key}/>
                </div>
                <Form.Floating>
                    <Form.Control id={this.props.captchaName} name={this.props.captchaName} size={"sm"} required={true}
                                  type={"text"} placeholder={this.props.label}
                                  onChange={this.onInputUpdate}
                                  value={this.state.captchaInput}/>
                    <Form.Label htmlFor={this.props.captchaName}>{this.props.label}</Form.Label>
                </Form.Floating>
            </div>
        );
    }
}


export {
    CaptchaComponent
}

export type {
    CaptchaComponentProps,
    CaptchaComponentState
}
