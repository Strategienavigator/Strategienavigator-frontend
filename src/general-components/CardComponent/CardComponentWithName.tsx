import React, {ChangeEvent, PureComponent} from "react";
import "./card-component-with-name.scss";
import {
    CardComponent,
    CardComponentFieldPlaceholder,
    CardComponentFields,
    isCardComponentFilled
} from "./CardComponent";
import FAE from "../Icons/FAE";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons";
import {Button, Card as BootstrapCard, Form, InputGroup} from "react-bootstrap";
import {CounterInterface} from "../Counter/CounterInterface";
import {UIErrorBanner} from "../Error/UIErrors/UIErrorBannerComponent/UIErrorBanner";
import {UIError} from "../Error/UIErrors/UIError";


export type CardComponentFieldsWithName<D = any> = CardComponentFieldsWithNameValues<D>[];

export interface CardComponentFieldsWithNameValues<D = any> {
    name: string,
    fields: CardComponentFields<D>
}

export interface CardComponentControlProps {
    min: number,
    max: number,
    hideDesc: boolean,
    counter?: CounterInterface,
    placeholder?: CardComponentFieldPlaceholder
}

export interface CardComponentWithNameProps<D = any> {
    name: string,
    min: number,
    max: number,
    disabled: boolean,
    values: CardComponentFieldsWithName<D>,
    onChanged: (values: CardComponentFieldsWithName<D>) => void,
    cardComponent: CardComponentControlProps
}

class CardComponentWithName<D extends object> extends PureComponent<CardComponentWithNameProps<D>> {

    render() {
        return (
            <>
                {this.props.values.map((data, index) => {
                    return (
                        <fieldset className={"card-component-with-name"}
                                  key={`card-component-with-name-${this.props.name}-${index}`}>
                            <legend>
                                <InputGroup>
                                    <Form.Control
                                        disabled={this.props.disabled}
                                        onInput={(e: ChangeEvent<HTMLInputElement>) => {
                                            this.registerUpdate(index, e.target.value, data.fields);
                                        }}
                                        defaultValue={data.name}
                                        type={"text"}
                                        placeholder={"Kategoriebezeichnung"}
                                    />

                                    {!this.props.disabled && (
                                        <Button
                                            className={"noButton"}
                                            onClick={() => this.onDelete(index)}
                                            variant={"link"}
                                        >
                                            <FAE icon={faTimes}/>
                                        </Button>
                                    )}
                                </InputGroup>
                            </legend>
                            <div>
                                <UIErrorBanner id={`${this.props.name}.${index}.name.empty`}/>

                                <CardComponent
                                    name={this.props.name}
                                    values={data.fields}
                                    min={this.props.cardComponent.min}
                                    max={this.props.cardComponent.max}
                                    hideDesc={this.props.cardComponent.hideDesc}
                                    disabled={this.props.disabled}
                                    counter={this.props.cardComponent.counter}
                                    placeholder={this.props.cardComponent.placeholder}
                                    onChanged={(values) => {
                                        this.registerUpdate(index, data.name, values);
                                    }}
                                />
                                <UIErrorBanner id={`${this.props.name}.${index}.fields.empty`}/>
                            </div>
                        </fieldset>
                    );
                })}

                {(this.props.values.length < this.props.max && !this.props.disabled) && (
                    <BootstrapCard onClick={this.addCard}
                                   className={"addCard"} body>
                        <div className={"icon"}>
                            <FAE icon={faPlus}/>
                        </div>
                    </BootstrapCard>
                )}
            </>
        );
    }

    registerUpdate = (index: number, name: string, values: CardComponentFields<D>) => {
        let newValues = [...this.props.values];
        newValues[index] = {
            name: name,
            fields: values
        }
        this.props.onChanged(newValues);
    }

    onDelete = (index: number) => {
        let newValues = [...this.props.values];
        newValues.splice(index, 1);
        this.props.onChanged([...newValues]);
    }

    addCard = () => {
        let newValue: CardComponentFieldsWithNameValues = {
            name: "",
            fields: []
        };

        if (this.props.values.length < this.props.max) {
            for (let i = 0; i < this.props.cardComponent.min; i++) {
                newValue.fields.push({
                    name: "",
                    desc: "",
                    id: null
                });
            }
            this.props.onChanged([...this.props.values, newValue]);
        }
    }

}

export const validateCardComponentWithNameFilled = (values: CardComponentFieldsWithName, name: string, errors: UIError[]): void => {
    values.forEach((data, index) => {
        if (data.name.length <= 0) {
            errors.push({
                level: "error",
                id: `${name}.${index}.name.empty`,
                message: "Bitte geben Sie eine Kategoriebezeichnung an!"
            });
        }
        if (!isCardComponentFilled(data.fields)) {
            errors.push({
                level: "error",
                id: `${name}.${index}.fields.empty`,
                message: "Bitte füllen Sie alle Felder aus!"
            });
        }
    });
}

export {
    CardComponentWithName
}