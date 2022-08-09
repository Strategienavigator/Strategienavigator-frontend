import {ModalCloseable} from "../../Modal/ModalCloseable";
import {Button, FloatingLabel, Form, FormGroup, FormSelect, Modal} from "react-bootstrap";
import {useState} from "react";
import {UserSearchResultResource} from "../../Datastructures";

interface SingleInviteModalProps {
    show: boolean
    onClose: () => void
    user: UserSearchResultResource | null
    onInvite: (user: UserSearchResultResource | null, permission: SingleInvitePermission) => void
}

type SingleInvitePermission = "0" | "1" | "2";

function SingleInviteModal(props: SingleInviteModalProps) {
    let defaultPermission: SingleInvitePermission = "0";
    const [permission, setPermission] = useState<SingleInvitePermission>(defaultPermission);

    return (
      <ModalCloseable
          show={props.show}
          className={"second-modal"}
          backdropClassName={"second-modal-backdrop"}
          centered
          onHide={() => {
              props.onClose();
          }}
          keyboard={true}
      >
          <Modal.Header>
              <h5><strong>{props.user?.username}</strong> einladen.</h5>
          </Modal.Header>
          <Modal.Body>
              <Form>
                  <FormGroup className="mb-3">
                      <FloatingLabel label={"Berechtigung"}>
                          <FormSelect required={true} size={"sm"} defaultValue={defaultPermission} id={"permission"}
                              onChange={(e) => {
                                  setPermission(e.target.value as SingleInvitePermission);
                              }}
                          >
                              <option value={"0"}>Nur Lesen</option>
                              <option value={"1"}>Lesen und Schreiben</option>
                              <option value={"2"}>Adminrechte</option>
                          </FormSelect>
                      </FloatingLabel>
                  </FormGroup>

                  <Button
                      size={"sm"}
                      variant={"primary"}
                      onClick={() => {
                          props.onInvite(props.user, permission);
                          props.onClose();
                      }}
                  >Einladen</Button>
              </Form>
          </Modal.Body>
      </ModalCloseable>
    );
}

export {
    SingleInviteModal
}
