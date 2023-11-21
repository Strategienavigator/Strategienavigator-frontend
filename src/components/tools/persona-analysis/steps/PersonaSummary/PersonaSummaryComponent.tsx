import React from "react";
import {Step, StepProp} from "../../../../../general-components/Tool/SteppableTool/StepComponent/Step/Step";
import {PersonaAnalysisValues} from "../../PersonaAnalysis";
import {Image} from "react-bootstrap";
import {PersonaInfoItem} from "./PersonaInfoItem";
import {CardComponentFieldsWithNameValues} from "../../../../../general-components/CardComponent/CardComponentWithName";
import {IconDefinition} from "@fortawesome/fontawesome-svg-core";
import {PersonaPersonalityComponent} from "../PersonaPersonality/PersonaPersonalityComponent";

export interface PersonaSummaryItem extends CardComponentFieldsWithNameValues {
    icon?: IconDefinition
}

export type PersonaSummaryValues = null | undefined;

export class PersonaSummaryComponent extends Step<PersonaAnalysisValues, {}> {

    public constructor(props: StepProp<PersonaAnalysisValues>, context: any) {
        super(props, context);
    }

    build(): JSX.Element {
        let info = this.props.save.data["persona-info"];
        let personality = this.props.save.data["persona-personality"];

        if (info && personality) {
            return (
                <div className={"items"}>
                    <div className={"avatar-item item"}>
                        <div className={"names"}>
                            {info.firstname}, {info.age} {info.age === 1 ? "Jahr" : "Jahre"} alt
                        </div>

                        <div className={"avatar-container"}>
                            <Image className={"avatar"} rounded
                                   src={this.props.resourceManager.getBlobURL("avatar") ?? undefined}/>
                        </div>
                    </div>
                    {Object.entries(personality.fields).map(([name, value], index) => {
                        return (
                            <PersonaInfoItem
                                key={"persona-info-item-" + name}
                                className={"item"}
                                title={PersonaPersonalityComponent.names[index] ?? ""}
                                icon={PersonaPersonalityComponent.icons[index] ?? undefined}
                                items={value}
                            />
                        );
                    })}
                    {personality.individual.map(value => {
                        return (
                            <PersonaInfoItem
                                key={"persona-info-item-" + value.name}
                                className={"item"}
                                title={value.name}
                                items={value.fields}
                            />
                        )
                    })}
                    {Object.entries(personality.fieldsElse).map(([name, value], index) => {
                        let values = value;
                        // Sonderfall: Zitate
                        if (index === 0) {
                            values = value.map(v => {
                                let value = Object.assign({}, v);
                                if (!value.name.startsWith('"')) {
                                    value.name = `"${value.name}`;
                                }
                                if (!value.name.endsWith('"')) {
                                    value.name = `${value.name}"`;
                                }
                                return value;
                            });
                        }

                        let length = Object.keys(personality!.fields).length;
                        return (
                            <PersonaInfoItem
                                key={"persona-info-item-" + name}
                                className={"item"}
                                title={PersonaPersonalityComponent.names[length + index] ?? ""}
                                icon={PersonaPersonalityComponent.icons[length + index] ?? undefined}
                                items={values}
                            />
                        );
                    })}
                </div>
            );
        }
        return <></>;
    }

}
