import {useState} from "react";
import {Button} from "react-bootstrap";
import FAE from "../../../../../../general-components/Icons/FAE";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";
import {ScaleDescriptionModal} from "./ScaleDescriptionModal";
import {UACriteriaCustomDescriptionValues} from "../UACriteriaCustomDescription";


function UACriteriaCustomDescriptionInfoPanel(props: {values: UACriteriaCustomDescriptionValues}) {
    let [showModal, setShowModal] = useState(false);

    return (
        <>
            <Button
                onClick={() => {
                    setShowModal(true);
                }}
                size={"sm"}
                style={{marginLeft: "0.5rem"}}
            >
                <FAE icon={faInfoCircle}/>
            </Button>

            <ScaleDescriptionModal
                show={showModal}
                values={props.values}
                onClose={() => {
                    setShowModal(false);
                }}
            />
        </>
    );
}

export {
    UACriteriaCustomDescriptionInfoPanel
}