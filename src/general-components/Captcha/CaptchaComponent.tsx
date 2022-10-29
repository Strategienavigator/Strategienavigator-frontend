import {Component} from "react";
import {CaptchaImage} from "./CaptchaImage";
import {CaptchaInput} from "./CaptchaInput";

class CaptchaComponent extends Component<any, any> {


    render() {
        return (
            <div className={"mt-2"}>
                <div className={"m-2"}>
                    <CaptchaImage/>
                </div>
                <CaptchaInput/>
            </div>
        );
    }
}


export {
    CaptchaComponent
}
