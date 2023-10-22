import React, {ReactNode} from "react";
import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {Col, Image, ListGroup, ListGroupItem, Row} from "react-bootstrap";
import {PersonaInfoItem} from "./PersonaInfoItem";
import {CardComponentFieldsWithNameValues} from "../../../../../general-components/CardComponent/CardComponentWithName";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {PersonaPersonalityComponent} from "../PersonaPersonality/PersonaPersonalityComponent";
import {faCoins, faUsers, faUserTag} from "@fortawesome/free-solid-svg-icons";
import FAE from "../../../../../general-components/Icons/FAE";
import {getFamilyStatus} from "../PersonaInfo/PersonaInfoComponent";
import {PDFExporterPreview} from "../../../../../general-components/Export/PDF/PDFExporterPreview";
import {PersonaPDFExporter} from "../../export/PersonaPDFExporter";

export interface PersonaSummaryItem extends CardComponentFieldsWithNameValues {
    icon?: IconDefinition
}

export type PersonaSummaryValues = null | undefined;

export class PersonaSummaryComponent extends Step<PersonaAnalysisValues, {}> {
    private i: number = 0;

    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
    }

    build(): JSX.Element {
        let info = this.props.save.data["persona-info"];
        let personality = this.props.save.data["persona-personality"];

        if (info && personality) {
            let items: PersonaSummaryItem[] = [
                ...Object.values(personality.fields).map<PersonaSummaryItem>((data, index) => {
                    return {
                        name: PersonaPersonalityComponent.names[index],
                        fields: data,
                        icon: PersonaPersonalityComponent.icons[index]
                    };
                }),
                ...personality.individual
            ];
            let left: PersonaSummaryItem[] = [];
            let right: PersonaSummaryItem[] = [];
            items.forEach((v, i) => {
                if (i % 2) {
                    right.push(v);
                } else {
                    left.push(v);
                }
            });

            let income: string | null = null;
            if (info.income !== null) {
                income = new Intl.NumberFormat(
                    "de-DE",
                    {
                        style: "currency",
                        currency: "EUR"
                    }
                ).format(info.income);
            }

            this.i = 0;
            return (
                <>
                    <Row>
                        <Col sm={6}>
                            <div className={"names"}>
                                {info.firstname}, {info.age} {info.age === 1 ? "Jahr" : "Jahre"} alt
                            </div>

                            <div className={"avatar-container"}>
                                <Image className={"avatar"} rounded
                                       src={this.props.resourceManager.getBlobURL("avatar") ?? undefined}/>
                            </div>

                            {this.getItemElements(left)}
                        </Col>
                        <Col sm={6}>
                            {(income !== null) && (
                                <this.InfoElement
                                    icon={faCoins}
                                    name={"Einkommen"}
                                    values={[`Monatlicher Nettoverdienst von ${income}`]}
                                />
                            )}
                            <this.InfoElement
                                icon={faUserTag}
                                name={"Familienstatus"}
                                values={[getFamilyStatus(info.familystatus)]}
                            />
                            <this.InfoElement
                                icon={faUsers}
                                name={"Familie & Freunde"}
                                values={info.family.length <= 0 ? ["Nicht angegeben"] : info.family.map<string>(i => i.name)}
                            />
                            {this.getItemElements(right)}
                        </Col>
                    </Row>
                </>
            );
        }
        return <></>;
    }

    public InfoElement(props: {
        icon: IconDefinition,
        name: string,
        values: ReactNode[]
    }) {
        return (
            <div className={"info-container"}>
                <div className={"title"}><FAE icon={props.icon}/> {props.name}</div>
                <div className={"content"}>
                    <ListGroup>
                        {props.values.map((data, index) => {
                            return (
                                <ListGroupItem key={`list-item-${index}-${props.name}`}>
                                    {data}
                                </ListGroupItem>
                            );
                        })}
                    </ListGroup>
                </div>
            </div>
        );
    }

    getItemElements = (items: PersonaSummaryItem[]): JSX.Element[] => {
        return items.map((data) => {
            this.i += 1;
            return (
                <PersonaInfoItem
                    key={"personality-item-individual-" + this.i}
                    title={data.name}
                    icon={data.icon}
                    items={data.fields}
                />
            );
        });
    }

}
