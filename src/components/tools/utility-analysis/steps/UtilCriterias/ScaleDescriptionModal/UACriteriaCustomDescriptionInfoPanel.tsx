import {Button, Collapse, Table} from "react-bootstrap";
import {UACriteriaCustomDescriptionValues} from "../UACriteriaCustomDescription";
import React, {useState} from "react";
import FAE from "../../../../../../general-components/Icons/FAE";
import {faInfoCircle} from "@fortawesome/free-solid-svg-icons";


function UACriteriaCustomDescriptionInfoPanel(props: { values: UACriteriaCustomDescriptionValues }) {
    let [open, setOpen] = useState(false);
    let isEmpty: boolean = props.values.headers.every((item) => item.desc === undefined || item.desc === "");

    if (!isEmpty) {
        return (
            <>
                <Button
                    size={"sm"}
                    onClick={() => setOpen(!open)}
                    style={{marginLeft: "0.5rem"}}
                >
                    <FAE icon={faInfoCircle}/>
                </Button>

                <Collapse in={open}>
                    <div>
                        <Table className={"mt-3"} size={"sm"} variant={"light"} bordered hover>
                            <thead>
                            <tr>
                                <th style={{width: "110px"}}>Skala</th>
                                <th>Beschreibung</th>
                            </tr>
                            </thead>
                            <tbody>
                            {props.values.headers.map((v, index) => {
                                return (
                                    <tr
                                        key={"custom-description-modal-" + v.header + "-" + index}
                                        className={(!props.values.activeIndices.includes(index + 1)) ? "tr-inactive" : ""}
                                    >
                                        <th style={{width: "90px"}} className={"header"}>{v.header}</th>
                                        <td className={"desc"}>{v.desc}</td>
                                    </tr>
                                );
                            })}
                            </tbody>
                        </Table>
                    </div>
                </Collapse>

            </>
        );
    } else {
        return null;
    }
}

export {
    UACriteriaCustomDescriptionInfoPanel
}