import {
    shallowCompareStepProps,
    Step,
    StepProp
} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {UIErrorBanner} from "../../../../../general-components/Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import {Col, Form, Image, Row} from "react-bootstrap";
import {ChangeEvent} from "react";
import {PersonaInfo} from "./PersonaInfo";
import {CardComponent, CardComponentFields} from "../../../../../general-components/CardComponent/CardComponent";
import {NumberCounter} from "../../../../../general-components/Counter/NumberCounter";


export interface PersonaInfoValues {
    "firstname": string | null,
    "age": number | null,
    "income": number | null,
    "family": CardComponentFields,
    "familystatus": number
}

export const getFamilyStatus = (i: number): string | undefined => {
    switch (i) {
        case 1:
            return "Ledig";
        case 2:
            return "Verheiratet";
        case 3:
            return "Verwitwet";
        case 4:
            return "Geschieden";
        default:
            return "Nicht angegeben";
    }
}

export class PersonaInfoComponent extends Step<PersonaAnalysisValues, {}> {
    static FILETYPES = ["png", "jpg", "jpeg"];
    static MAXFILESIZE = 2000;

    static MAXFAMILY = 4;
    static MINFAMILY = 0;

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
                            <Form.Control disabled={this.props.disabled} required onChange={this.firstNameChanged}
                                          type={"text"}
                                          value={data?.firstname ?? ""} placeholder={"Max"}/>
                            <UIErrorBanner id={"firstname.empty"}/>
                            <UIErrorBanner id={"firstname.toolong"}/>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Alter</Form.Label>
                            <Form.Control disabled={this.props.disabled} onChange={this.ageChanged} type={"number"}
                                          value={data?.age === -1 ? undefined : data?.age ?? ""}
                                          min={PersonaInfo.AGE_MIN} max={PersonaInfo.AGE_MAX}
                                          placeholder={"25"}/>
                            <UIErrorBanner id={"age.invalid"}/>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Avatar/Personenfoto</Form.Label>
                            <Form.Control disabled={this.props.disabled} type="file" onChange={this.avatarChanged}/>
                            <Form.Text>Gültige
                                Dateitypen: {PersonaInfoComponent.FILETYPES.map(i => "." + i).join(", ")}</Form.Text> <br/>
                            <Form.Text>Maximalgröße: {PersonaInfoComponent.MAXFILESIZE / 1000} MB</Form.Text>

                            <UIErrorBanner id={"avatar.empty"}/>
                            <UIErrorBanner id={"avatar.size"}/>
                            <UIErrorBanner id={"avatar.type"}/>
                        </Form.Group>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Einkommen (Netto/Monat in €)</Form.Label>
                            <Form.Control disabled={this.props.disabled} onInput={this.incomeChanged} type={"text"}
                                          placeholder={"2400"}/>
                            <UIErrorBanner id={"income.invalid"}/>
                        </Form.Group>
                    </Col>
                </Row>

                <Row>
                    <Col sm={6}>
                        <div className={"avatar-preview"}>
                            <Image
                                src={this.props.resourceManager.getBlobURL("avatar") ?? undefined}
                                thumbnail rounded
                                className={"avatar"} alt={"Avatar Vorschau"}/>
                        </div>
                    </Col>
                    <Col sm={6}>
                        <Form.Group className="mb-3">
                            <Form.Label>Familienstand</Form.Label>
                            <Form.Select
                                disabled={this.props.disabled}
                                onChange={this.onFamilyStatusChange}
                                defaultValue={data?.familystatus}
                            >
                                <option value={0}>-- Auswählen --</option>
                                {[...Array(4)].map((v, i) => {
                                    return (
                                        <option key={"family-status" + i} value={i + 1}>
                                            {getFamilyStatus(i + 1)}
                                        </option>
                                    );
                                })}
                            </Form.Select>
                        </Form.Group>
                        <Form.Group className="mb-3">
                            <Form.Label>Familie & Freunde</Form.Label>
                            <CardComponent
                                disabled={this.props.disabled}
                                values={data?.family ?? []}
                                max={PersonaInfoComponent.MAXFAMILY}
                                min={PersonaInfoComponent.MINFAMILY}
                                hideDesc
                                required={false}
                                counter={new NumberCounter()}
                                name={"family"}
                                onChanged={this.familyChanged}
                            />

                            <UIErrorBanner id={"family.length"}/>
                        </Form.Group>
                    </Col>
                </Row>
            </>
        );
    }

    firstNameChanged = (e: ChangeEvent<HTMLInputElement>) => {
        this.props.saveController.onChanged(save => {
            let data = save.data["persona-info"];
            if (data !== undefined) data.firstname = e.target.value;
        });
    }

    ageChanged = (e: ChangeEvent<HTMLInputElement>) => {
        this.props.saveController.onChanged(save => {
            let data = save.data["persona-info"];
            if (data !== undefined) {
                let parsed = parseInt(e.target.value);
                if (isNaN(parsed)) {
                    data.age = -1;
                } else {
                    data.age = parsed;
                }
            }
        });
    }

    incomeChanged = (e: ChangeEvent<HTMLInputElement>) => {
        this.props.saveController.onChanged(save => {
            let data = save.data["persona-info"];
            if (data !== undefined) {
                if (e.target.value.length <= 0) {
                    data.income = null;
                } else {
                    let parsed = parseInt(e.target.value);
                    if (isNaN(parsed)) {
                        data.income = -1;
                    } else {
                        data.income = parsed;
                    }
                }
            }
        });
    }

    avatarChanged = (e: ChangeEvent<HTMLInputElement>) => {
        let file: File | null = null;
        if (e.target.files !== null) {
            file = e.target.files.item(0);
            if (file) {
                this.props.resourceManager.onChanged("avatar", file);
                this.forceUpdate();
            }
        }
    }

    private onFamilyStatusChange = (e: ChangeEvent<HTMLSelectElement>) => {
        this.props.saveController.onChanged(save => {
            if (save.data["persona-info"]) {
                save.data["persona-info"].familystatus = e.target.selectedIndex;
            }
        });
    }

    private familyChanged = (fields: CardComponentFields) => {
        this.props.saveController.onChanged(save => {
            if (save.data["persona-info"]) {
                save.data["persona-info"].family = fields;
            }
        });
    }
}
