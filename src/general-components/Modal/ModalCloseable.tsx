import {Component} from "react";
import * as React from "react";
import {Modal, ModalProps} from "react-bootstrap";
import {faTimes} from "@fortawesome/free-solid-svg-icons";
import FAE from "../Icons/FAE";

import "./modal-closeable.scss";


class ModalCloseable extends Component<ModalProps, any> {

    render() {
        return (
            <Modal
                {...this.props}
            >
                {this.props.children}

                <div className={"modal-closeable"} onClick={this.props.onHide}>
                    <FAE icon={faTimes} />
                </div>
            </Modal>
        );
    }

}

export {
    ModalCloseable
}
