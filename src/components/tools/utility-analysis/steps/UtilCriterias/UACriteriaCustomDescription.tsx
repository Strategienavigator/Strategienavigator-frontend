import {Accordion, Col, Form, FormControl, InputGroup, Row} from "react-bootstrap";
import {CustomDescriptionComponent} from "../../../../../general-components/CardComponent/CustomDescriptionComponent/CustomDescriptionComponent";
import {ChangeEvent} from "react";
import {CompareHeader} from "../../../../../general-components/CompareComponent/Header/CompareHeaderAdapter";
import {isDesktop} from "../../../../../general-components/Desktop";

/**
 * Werte für die Custom Description
 */
export interface UACriteriaCustomDescriptionValues {
    headers: CompareHeader[]
    activeIndices: number[]
}

interface UACriteriaCustomDescriptionState {
}

/**
 * Diese Klasse stellt eine benutzerdefinierte Beschreibung des zweiten Schritts der Nutzwertanalyse dar.
 * Sie soll es ermöglichen, für jedes Kriterium den Header beschreiben zu können.
 * So kann man bspw. für das + im Header +10% als Beschreibung eintragen. Dies soll für jeden Header möglich sein.
 */
class UACriteriaCustomDescription extends CustomDescriptionComponent<UACriteriaCustomDescriptionValues, UACriteriaCustomDescriptionState> {

    render() {
        let values = this.props.value;
        let headerLength = values.headers.length;

        return (
            <div style={{marginTop: "0.25rem"}}>
                <Accordion aria-disabled={this.props.disabled}>
                    <Accordion.Item aria-disabled={this.props.disabled} eventKey={"0"}>
                        <Accordion.Header>
                            Skala
                        </Accordion.Header>
                        <Accordion.Body>
                            <div className={"scale " + ((isDesktop() ? "desktop" : "mobile"))}>
                                <InputGroup>
                                    <InputGroup.Text id={"desc"}>Anzahl Skala-Elemente</InputGroup.Text>
                                    <Form.Select disabled={this.props.disabled} onChange={this.presetChanged}
                                                 aria-describedby={"desc"} defaultValue="5">
                                        <option value="2">
                                            2
                                        </option>
                                        <option value="3">
                                            3
                                        </option>
                                        <option value={headerLength}>
                                            {headerLength}
                                        </option>
                                    </Form.Select>
                                </InputGroup>

                                <div className={"headers"}>
                                    {values.headers.map((v, index) => {
                                        let mustBeChecked = (index === 0 || index === headerLength - 1) ? true : undefined
                                        let shallBeChecked = values.activeIndices.includes(index + 1);

                                        return (
                                            <Row className={"singleScale"} key={"row-" + index}>
                                                <Col className={"header"} xs={2}>
                                                    {v.header}
                                                </Col>
                                                <Col className={"checkbox"}>
                                                    <Form.Check
                                                        onChange={this.toggledSelection}
                                                        checked={mustBeChecked ?? shallBeChecked}
                                                        disabled={this.props.disabled ? true : mustBeChecked}
                                                        value={index + 1}
                                                    />
                                                </Col>
                                                <Col className={"description"}>
                                                    {/*TODO remove bind*/}
                                                    <FormControl
                                                        type={"text"}
                                                        disabled={this.props.disabled ? true : !shallBeChecked}
                                                        value={v.desc}
                                                        size={"sm"}
                                                        placeholder={v.header}
                                                        onChange={this.descriptionChanged.bind(this, index)}
                                                    />
                                                </Col>
                                            </Row>
                                        );
                                    })}
                                </div>
                            </div>
                        </Accordion.Body>
                    </Accordion.Item>
                </Accordion>
            </div>
        );
    }

    isEmpty(): boolean {
        return false;
    }

    private toggledSelection = (e: ChangeEvent<HTMLInputElement>) => {
        let selected = e.target.checked;
        let value = Number(e.target.value);
        let newActiveIndices = [...this.props.value.activeIndices];

        if (value !== 1 && value !== this.props.value.headers.length) {
            if (selected) {
                newActiveIndices.push(value);
            } else {
                newActiveIndices = newActiveIndices.filter((item) => {
                    return item !== value;
                });
            }

            this.props.onChanged({
                headers: this.props.value.headers,
                activeIndices: newActiveIndices
            });
        }
    }

    private presetChanged = (e: ChangeEvent<HTMLSelectElement>) => {
        let values = this.props.value;
        let selected = e.target.value;
        let newActiveIndices = [...values.activeIndices];

        if (selected === "2") { // Only 1 and headers.length
            newActiveIndices = [1, values.headers.length];
        } else if (selected === "3") { // 1 and headers.length & mid
            let middle = Math.ceil(values.headers.length / 2);
            newActiveIndices = [1, middle, values.headers.length];
        } else { // All
            newActiveIndices = Array(values.headers.length).fill(0).map((_, i) => i + 1);
        }

        this.props.onChanged({
            headers: this.props.value.headers,
            activeIndices: newActiveIndices
        });
    }

    private descriptionChanged = (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.preventDefault();

        const newHeaders = this.props.value.headers.slice();

        const value = event.target.value;
        newHeaders[index] = {
            header: newHeaders[index].header,
            desc: value
        };

        this.props.onChanged({
            headers: newHeaders,
            activeIndices: this.props.value.activeIndices
        });
    };

}

export {
    UACriteriaCustomDescription
}
