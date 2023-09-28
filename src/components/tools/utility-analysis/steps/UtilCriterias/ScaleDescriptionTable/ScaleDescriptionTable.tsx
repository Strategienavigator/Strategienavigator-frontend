import React from 'react';
import {Table} from "react-bootstrap";
import {UACriteriaCustomDescriptionValues} from "../UACriteriaCustomDescription";

function ScaleDescriptionTable(props: UACriteriaCustomDescriptionValues) {
    return (
        <>
            <Table className={"mt-3"} size={"sm"} variant={"light"} bordered hover>
                <thead>
                <tr>
                    <th style={{width: "110px"}}>Skala</th>
                    <th>Beschreibung</th>
                </tr>
                </thead>
                <tbody>
                {props.headers.map((v, index) => {
                    return (
                        <tr
                            key={"custom-description-modal-" + v.header + "-" + index}
                            className={(!props.activeIndices.includes(index + 1)) ? "tr-inactive" : ""}
                        >
                            <th style={{width: "90px"}} className={"header"}>{v.header}</th>
                            <td className={"desc"}>{v.desc}</td>
                        </tr>
                    );
                })}
                </tbody>
            </Table>
        </>
    )
}

export{
    ScaleDescriptionTable
}