import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import {Col, Form, Row} from "react-bootstrap";
import {ChangeEvent} from "react";
import {PersonaInfo} from "./PersonaInfo";


export interface PersonaInfoValues {
    "firstname": string | null,
    "lastname": string | null,
    "age": number | null,
    "avatar": string | null
}

export class PersonaInfoComponent extends Step<PersonaAnalysisValues, {}> {

    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
    }

    shouldComponentUpdate(nextProps: Readonly<StepProp<PersonaAnalysisValues>>, nextState: Readonly<{}>, nextContext: any): boolean {
        let shouldUpdate: boolean;
        shouldUpdate = !shallowCompareStepProps(this.props, nextProps);
        if (!shouldUpdate) {
            const oldSave = this.props.save;
            const newSave = nextProps.save;
            if (oldSave.data["persona-info"] !== newSave.data["persona-info"]) {
                shouldUpdate = true;
            }
        }
        return shouldUpdate;
    }

    build(): JSX.Element {
        let data = this.props.save.data["persona-info"];
        return (
            <>
                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Vorname</Form.Label>
                            <Form.Control onChange={this.firstNameChanged} type={"text"} value={data?.firstname ?? ""} placeholder={"Max"}/>
                            <UIErrorBanner id={"firstname.empty"} />
                            <UIErrorBanner id={"firstname.toolong"} />
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Nachname</Form.Label>
                            <Form.Control onChange={this.lastNameChanged} type={"text"} value={data?.lastname ?? ""} placeholder={"Mustermann"}/>
                            <UIErrorBanner id={"lastname.empty"} />
                            <UIErrorBanner id={"lastname.toolong"} />
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Alter</Form.Label>
                            <Form.Control onChange={this.ageChanged} type={"number"} value={data?.age === -1 ? undefined : data?.age ?? ""} min={PersonaInfo.AGE_MIN} max={PersonaInfo.AGE_MAX}/>
                            <UIErrorBanner id={"age.invalid"} />
                            <UIErrorBanner id={"age.outofrange"} />
                        </Form.Group>
                    </Col>
                    <Col sm={6}></Col>
                </Row>

                <Form.Group className="mb-3">
                    <Form.Label>Avatar wählen...</Form.Label>
                    <Form.Control type="file" />
                </Form.Group>
            </>
        );
    }

    firstNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        this.props.saveController.onChanged(save => {
            let data = save.data["persona-info"];
            if (data !== undefined) data.firstname = e.target.value;
        });
    }

    lastNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        this.props.saveController.onChanged(save => {
            let data = save.data["persona-info"];
            if (data !== undefined) data.lastname = e.target.value;
        });
    }

    ageChanged = (e: ChangeEvent<HTMLInputElement>) => {
        this.props.saveController.onChanged(save => {
            let data = save.data["persona-info"];
            if (data !== undefined) {
                let parsed= parseInt(e.target.value);
                if (isNaN(parsed)) {
                    data.age = -1;
                } else {
                    data.age = parsed;
                }
            }
        });
    }
}
