import {Button, FloatingLabel, Form, FormControl, FormGroup, FormSelect, Modal} from "react-bootstrap";

import {ModalCloseable} from "../../Modal/ModalCloseable";
import {useState} from "react";


export type InvitationPermission = "0" | "1";
export type InvitationExpiryDate = "infinite" | "week" | "month" | "own" | Date;

export interface InvitationLinkProps {
    show: boolean
    onClose: () => void
    onCreation: (permission: InvitationPermission, expiry_date: Date | null) => void
}

function InvitationLinkModal(props: InvitationLinkProps) {
    let defaultPermission: InvitationPermission = "0";
    let defaultExpiryDate: InvitationExpiryDate = "infinite";
    let defaultOwnDate = new Date();
    defaultOwnDate.setDate(defaultOwnDate.getDate() + 7);

    const [permission, setPermission] = useState<InvitationPermission>(defaultPermission);
    const [expiryDate, setExpiryDate] = useState<InvitationExpiryDate>(defaultExpiryDate);
    const [ownDate, setOwnDate] = useState<Date | null>(defaultOwnDate);

    const [noDate, setNoDate] = useState(false);
    const [dateGreaterThanToday, setDateGreaterThanToday] = useState(false);
    let minDate = new Date();
    minDate.setDate(minDate.getDate() + 1);

    return (
        <ModalCloseable
            show={props.show}
            className={"second-modal"}
            backdropClassName={"second-modal-backdrop"}
            centered
            onHide={() => {
                setNoDate(false);
                setDateGreaterThanToday(false);
                setExpiryDate(defaultExpiryDate);
                setPermission(defaultPermission);

                props.onClose();
            }}
            keyboard={true}
        >
            <Modal.Header>
                <h5>Einladungslink erstellen</h5>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <FormGroup className="mb-3">
                        <FloatingLabel label={"Berechtigung"}>
                            <FormSelect required={true} size={"sm"} defaultValue={defaultPermission} id={"permission"}
                                        onChange={(e) => {
                                            setPermission(e.target.value as InvitationPermission);
                                        }}
                            >
                                <option value={"0"}>Nur Lesen</option>
                                <option value={"1"}>Lesen und Schreiben</option>
                            </FormSelect>
                        </FloatingLabel>
                    </FormGroup>

                    <FormGroup className="mb-3">
                        <FloatingLabel label={"Ablaufdatum"}>
                            <FormSelect required={true} size={"sm"} defaultValue={defaultExpiryDate}
                                        onChange={(e) => {
                                            setExpiryDate(e.target.value as InvitationExpiryDate);
                                        }}
                            >
                                <option value="infinite">Unbegrenzt</option>
                                <option value="week">1 Woche</option>
                                <option value="month">1 Monat</option>
                                <option value="own">eigenes Datum</option>
                            </FormSelect>
                        </FloatingLabel>

                        {(expiryDate === "own") && (
                            <>
                                <FloatingLabel label={"Eigenes Datum"}>
                                    <FormControl
                                        type={"date"}
                                        size={"sm"}
                                        defaultValue={ownDate?.toLocaleDateString("en-CA")}
                                        onChange={(e) => {
                                            let value = e.currentTarget.value;

                                            if (value === "" || value === null || value === undefined) {
                                                setOwnDate(null);
                                            } else {
                                                setOwnDate(new Date(value));
                                            }
                                        }}
                                    />
                                </FloatingLabel>

                                <div className={"feedbackContainer sm"}>
                                    {(noDate) && (
                                        <div className={"feedback DANGER"}>
                                            Bitten geben Sie ein Datum an!
                                        </div>
                                    )}
                                    {(dateGreaterThanToday) && (
                                        <div className={"feedback DANGER"}>
                                            Bitte geben Sie mindestens den {minDate.toLocaleDateString("de-DE")} an!
                                        </div>
                                    )}
                                </div>
                            </>
                        )}
                    </FormGroup>

                    <Button
                        size={"sm"}
                        variant={"primary"}
                        onClick={async () => {
                            setNoDate(false);
                            setDateGreaterThanToday(false);

                            let currentDate = new Date();
                            let error = false;

                            if (ownDate === null) {
                                setNoDate(true);
                                error = true;
                            } else if (currentDate >= ownDate) {
                                setDateGreaterThanToday(true);
                                error = true;
                            }

                            if (!error) {
                                let date: Date | null = new Date();

                                if (expiryDate === "infinite") {
                                    date = null;
                                } else if (expiryDate === "own" && ownDate !== null) {
                                    date = ownDate;
                                } else if (expiryDate === "month") {
                                    date = new Date(date.setMonth(date.getMonth() + 1));
                                } else if (expiryDate === "week") {
                                    date = new Date(date.setDate(date.getDate() + 7));
                                }

                                await props.onCreation(permission, date);

                                setNoDate(false);
                                setDateGreaterThanToday(false);
                                setExpiryDate(defaultExpiryDate);
                                setPermission(defaultPermission);

                                props.onClose();
                            }
                        }}
                    >
                        Link erstellen
                    </Button>
                </Form>
            </Modal.Body>
        </ModalCloseable>
    );
}

export {
    InvitationLinkModal
}
