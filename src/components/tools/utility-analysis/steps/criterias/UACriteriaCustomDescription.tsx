import {CompareHeader} from "../../../../../general-components/CompareComponent/Header/CompareHeader";
import {Button, Col, Collapse, FormControl, Row} from "react-bootstrap";
import {
    CustomDescriptionComponent,
    CustomDescriptionComponentProps
} from "../../../../../general-components/CardComponent/CustomDescriptionComponent/CustomDescriptionComponent";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {CardComponentField} from "../../../../../general-components/CardComponent/CardComponent";
import {FormEvent} from "react";


export interface UACriteriaCustomDescriptionValues {
    headers: {
        header: string,
        desc: string
    }[]
}

export interface UACriteriaCustomDescriptionProps {
    header: CompareHeader
}

interface UACriteriaCustomDescriptionState {
    collapsed: boolean
}

class UACriteriaCustomDescription extends CustomDescriptionComponent<UACriteriaCustomDescriptionValues, UACriteriaCustomDescriptionProps, UACriteriaCustomDescriptionState> {

    constructor(props: (UACriteriaCustomDescriptionProps & CustomDescriptionComponentProps) | Readonly<UACriteriaCustomDescriptionProps & CustomDescriptionComponentProps>) {
        super(props);

        this.state = {
            collapsed: false
        };
    }

    render() {
        let values = this.props.value as UACriteriaCustomDescriptionValues & CardComponentField;

        return (
            <div style={{marginTop: "0.25rem"}}>
                <Button
                    variant={"light"}
                    onClick={() => {
                        this.setState({
                            collapsed: !this.state.collapsed
                        });
                    }}
                    size={"sm"}
                >
                    Skalar <FontAwesomeIcon icon={this.state.collapsed ? faCaretUp : faCaretDown}/>
                </Button>

                <Collapse in={this.state.collapsed}>
                    <div>
                        {this.props.header.getHeaders().map((v, index) => {
                            let value;
                            if (values && values.headers) {
                                value = values.headers[index];
                            }

                            return (
                                <Row key={"row-" + index}>
                                    <Col style={{textAlign: "center"}} xs={2}>{v}</Col>
                                    <Col>
                                        <FormControl
                                            type={"text"}
                                            disabled={this.props.disabled}
                                            defaultValue={value?.desc}
                                            name={this.props.name + "[" + this.props.index + "][" + index + "][scale][desc]"}
                                        />
                                        <input type={"hidden"} defaultValue={v}
                                               name={this.props.name + "[" + this.props.index + "][" + index + "][scale][header]"}/>
                                    </Col>
                                </Row>
                            );
                        })}
                    </div>
                </Collapse>
            </div>
        );
    }

    extractSingle(index: number, e: FormEvent<HTMLFormElement>): UACriteriaCustomDescriptionValues {
        let headers = [];
        let elements = e.currentTarget.elements;

        for (let i = 0; i < this.props.header.getCount(); i++) {
            let desc = elements.namedItem(this.props.name + "[" + index + "][" + i + "][scale][desc]") as HTMLInputElement;
            let header = elements.namedItem(this.props.name + "[" + index + "][" + i + "][scale][header]") as HTMLInputElement;

            headers.push({
                desc: desc.value,
                header: header.value
            });
        }

        return {
            headers: headers
        };
    }

}

export {
    UACriteriaCustomDescription
}
