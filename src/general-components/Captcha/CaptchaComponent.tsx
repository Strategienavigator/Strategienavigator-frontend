import React, {ChangeEvent, useEffect, useState} from "react";
import {CallInterface} from "../API/API";
import {CaptchaResponse} from "../Datastructures";
import {getCaptcha} from "../API/calls/Captcha";
import {Form} from "react-bootstrap";

import './captcha-image.scss';


interface CaptchaComponentProps {
    /**
     * name des input elements des captcha keys
     */
    keyName?: string

    /**
     * Label of input tag
     */
    label?: string,

    /**
     * input tag name of the captcha
     */
    captchaName?: string,

    /**
     * interval at which the image is refreshed in seconds
     */
    refreshIntervall?: number

}

const fallbackImage = "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAHgAAAAkCAYAAABCKP5eAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsMAAA7DAcdvqGQAAAONSURBVHhe7ZpZqE1RGMcvMkamkEwRiUx5EBkikXmmpIhkKqJ4wAsJ5UmSQsmL6YVCiZKpUGYiSijzkHnM+P+f/X2se1r7nn1399bax/erX99aa+99Lvs7a+291jolhmEYhmEYhmEYFcpYeFhsxwYjPePEOrlacvrBpbBnrvaPaXBqVEzNDPhb7MEGIx3jod5IJqY8fIW87lyuFrEQ6udNYENKMp/gqhJDorz/Jj2/hkTyUyKpKbEyGAE5fB+EjdgQGsWQYPbQ1XBxrhaxHbIXz4J72FBJdIQj4WgYZIJDwR2iZ7IhEAoN0UugHm/PhtAohh6s1IUtYYNcrfxUgV2j4l/cYd9HbYnBEmKCq0lMQie4Cl6EH+BD+Aa+hifhMFgIDuU89zu8Dl/BA7A55JfGx2n4EvJvK7fgW/gE3ocDoCG4Q/Q8NiRgENRr1BeetkUwjo0w/3z1B9zr1N0h+h50z/U5GBqCm+AFbEgA5748/xCcDltBUh3y2fkN8vgD6GM21L95U+pt4FzIN2M9proJ5tx7KNwH9fh8yP8HTTJy/FekSTCH0LJ6yTKon+l7QboCeewx5NtwPtugXh/3GWugHueXIzhCfAYn5Sk8HhW98Lmq5L/hjoKasJ3wTlQsxRy4JSpmlywnuBDvJJImEhV3Xfm8RB+XJWaWYkkw31g5JK+DWyGfjZthHG0lklMS0/BLYrBkPcED4QnIJG2AyyGH1ilwCIxDezCnVu+jYir4ph00WU4wk3tEIqdH6+FE2Avy+ToZxqHDdz1YPyqmgnPnoMlygtlba8FnsC9cAffDC/AavA3jeCSR6PTKB9+Oy8J6cEIK3UgfulJ0FN6Nionh1EgZLtFHoU1+twfzyxYcWe3B/FGA3lCuIfvg4kcc7OkKf2Tgg7tTK6NiLJyqKWWNBP89vMm6YMCtvjGQPcunwl7L8zlM9maD0AzugPp5lKtM+eyGenwX7A5JB7gJutdT30JHf6jHuSfMzQ7C0SXtpkdR4ia4kLpoMQm67TfgWad+CXIaw7Ivwa2hrmap3CTQMp/TfLZr3Zdgwo0HPYd+lmjLlQ785j+Hn8SPHjmloS2gwiXOq9C9wXxDXgsJd3jY5kswaQzPQE2Kynk0HwENnba4BHeGx6B7/RfYBxoVBBcu+POZbrlaabhmnYQukJsI+WvK3DJMMpVqCjlly99TNgzDMAzDMAzDMEKhpOQPsXT9SnD6LfkAAAAASUVORK5CYII=";


function CaptchaComponent({
                              keyName = "captcha_key",
                              label = "Captcha",
                              captchaName = "captcha",
                              refreshIntervall = 60
                          }: CaptchaComponentProps): React.JSX.Element {


    /**
     * Bilddaten des captchas oder fallback bild
     */
    const [img, setImg] = useState(fallbackImage);
    /**
     * key des captcha
     */
    const [key, setKey] = useState<string>('');
    /**
     * ob gerade ein captcha geladen wird
     */
    const [loading, setLoading] = useState(false);
    /**
     * ob es beim Abrufen des captchas ein fehler gab
     */
    const [error, setError] = useState(false);
    /**
     * contents of input tag
     */
    const [captchaInput, setCaptchaInput] = useState("");

    function onInputUpdate(event: ChangeEvent<HTMLInputElement>) {
        setCaptchaInput(event.target.value);
    }

    useEffect(() => {
        let scheduler: NodeJS.Timeout;
        let ignore = false;

        function scheduleRefresh() {
            scheduler = setTimeout(loadCaptcha, refreshIntervall * 1000)
        }

        /**
         * Lädt ein Captcha vom Backend
         */
        async function loadCaptcha() {
            setLoading(true);
            setError(false);

            let captchaData = await new Promise<CallInterface<CaptchaResponse> | null>((resolve, reject) => {
                getCaptcha({errorCallback: reject}).then(resolve).catch(reject)
            });
            if (ignore) {
                return;
            }

            if (captchaData && captchaData.success) {
                setImg(captchaData.callData.img);
                setKey(captchaData.callData.key);
                setLoading(false);
                setCaptchaInput("");

                scheduleRefresh();
            } else {
                setLoading(false);
                setError(true);
            }
        }

        loadCaptcha().catch(console.error);

        return () => {
            ignore = true;
            if (scheduler) {
                clearTimeout(scheduler);
            }

        }
    }, [refreshIntervall]);


    let scrolling = !loading && !error
    return (
        <div className={"mt-2"}>
            <div className={"my-2 ms-1"}>
                <div className={"image-container"}>
                    <img className={"border-dark border image"} src={img}
                         alt={"Captcha Bild, frage eine Person um Hilfe."}/>
                    <div style={{
                        animationDuration: refreshIntervall + "s"
                    }} className={"scrollbar" + (scrolling ? " scrolling-bar" : "")}>

                    </div>
                </div>


                <input
                    id={keyName}
                    type={"hidden"}
                    name={keyName}
                    value={key}/>
            </div>
            <Form.Floating>
                <Form.Control id={captchaName} name={captchaName} size={"sm"} required={true}
                              type={"text"} placeholder={label}
                              onChange={onInputUpdate}
                              value={captchaInput}/>
                <Form.Label htmlFor={captchaName}>{label}</Form.Label>
            </Form.Floating>
        </div>
    );
}


export {
    CaptchaComponent,
    fallbackImage
}

export type {
    CaptchaComponentProps
}
