import {Button, Col, Collapse, FormControl, Row} from "react-bootstrap";
import {
    CustomDescriptionComponent,
    CustomDescriptionComponentProps
} from "../../../../../general-components/CardComponent/CustomDescriptionComponent/CustomDescriptionComponent";
import {faCaretDown, faCaretUp} from "@fortawesome/free-solid-svg-icons";
import FAE from "../../../../../general-components/Icons/FAE";
import {ChangeEvent} from "react";
import {CompareHeader} from "../../../../../general-components/CompareComponent/Header/CompareHeaderAdapter";
import {isDesktop} from "../../../../../general-components/Desktop";


/**
 * Werte für die Custom Description
 */
export interface UACriteriaCustomDescriptionValues {
    headers: CompareHeader[]
}

interface UACriteriaCustomDescriptionState {
    collapsed: boolean
}

/**
 * Diese Klasse stellt eine benutzerdefinierte Beschreibung des zweiten Schritts der Nutzwertanalyse dar.
 * Sie soll es ermöglichen, für jedes Kriterium den Header beschreiben zu können.
 * So kann man bspw. für das + im Header +10% als Beschreibung eintragen. Dies soll für jeden Header möglich sein.
 */
class UACriteriaCustomDescription extends CustomDescriptionComponent<UACriteriaCustomDescriptionValues, UACriteriaCustomDescriptionState> {

    constructor(props: (CustomDescriptionComponentProps<UACriteriaCustomDescriptionValues>) | Readonly<CustomDescriptionComponentProps<UACriteriaCustomDescriptionValues>>) {
        super(props);

        this.state = {
            collapsed: false
        };
    }

    render() {
        let values = this.props.value;

        return (
            <div style={{marginTop: "0.25rem"}}>
                <Button
                    variant={"light"}
                    onClick={this.toggleCollapse}
                    size={"sm"}
                >
                    Skala <FAE icon={this.state.collapsed ? faCaretUp : faCaretDown}/>
                </Button>

                <Collapse in={this.state.collapsed}>
                    <div className={"scale " + ((isDesktop() ? "desktop" : "mobile"))}>
                        {values.headers.map((v, index) => {

                            return (
                                <Row key={"row-" + index}>
                                    <Col style={{textAlign: "center"}} xs={2}>{v.header}</Col>
                                    <Col>
                                        {/*TODO remove bind*/}

                                        <FormControl
                                            type={"text"}
                                            disabled={this.props.disabled}
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
                </Collapse>
            </div>
        );
    }


    private descriptionChanged = (index: number, event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        event.preventDefault();

        const newHeaders = this.props.value.headers.slice();

        const value = event.target.value;
        newHeaders[index] = {
            header: newHeaders[index].header,
            desc: value
        };

        this.props.onChanged({headers: newHeaders});
    };

    private toggleCollapse = () => {
        this.setState({
            collapsed: !this.state.collapsed
        });
    };

}

export {
    UACriteriaCustomDescription
}
