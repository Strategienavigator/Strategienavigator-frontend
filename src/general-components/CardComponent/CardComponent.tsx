import React, {ChangeEvent, Component} from "react";
import {Button, Card as BootstrapCard, Collapse, FormControl, InputGroup} from "react-bootstrap";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons/";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {isDesktop} from "../Desktop";
import {CounterInterface} from "../Counter/CounterInterface";

import "./card-component.scss";


export interface CardProps {
    id: string | null
    name: string
    desc: string
    designation?: string
    disabled: boolean
    required: boolean
    onChange: (name: string, desc: string) => void
    onDelete?: () => void
    placeholder?: CardComponentFieldPlaceholder
}

export interface CardState {
    showDesc: boolean
    descChanged: boolean
}

class Card extends Component<CardProps, CardState> {

    constructor(props: CardProps | Readonly<CardProps>) {
        super(props);

        this.state = {
            showDesc: isDesktop(),
            descChanged: false
        };
    }

    nameChanged = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        this.props.onChange(e.currentTarget.value, this.props.desc);
    }

    descChanged = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        let value = e.currentTarget.value;
        this.setState({
            descChanged: value.length > 0
        });
        this.props.onChange(this.props.name, value);


    }

    onDelete = () => {
        if (this.props.onDelete !== undefined) {
            this.props.onDelete();
        }
    }

    render = () => {
        return (
            <div>
                <InputGroup>
                    <div className={"id"} aria-disabled={this.props.disabled}>
                        {this.props.id}
                    </div>
                    <FormControl
                        required={this.props.required}
                        disabled={this.props.disabled}
                        onBlur={() => this.state.descChanged ? this.setState({showDesc: false}) : null}
                        onChange={(e) => this.nameChanged(e)}
                        onFocus={() => this.setState({showDesc: true})}
                        name={this.props.name + "[][name]"}
                        spellCheck={false}
                        value={this.props.designation}
                        placeholder={(this.props.placeholder?.name !== undefined) ? this.props.placeholder?.name : "Bezeichnung"}
                    />
                    {
                        ((!this.props.disabled) && this.props.onDelete !== undefined) ? (
                            <Button className={"noButton"} onClick={this.onDelete} variant={"link"}>
                                <FontAwesomeIcon icon={faTimes}/>
                            </Button>
                        ) : undefined
                    }
                </InputGroup>
                <Collapse in={isDesktop() || this.state.showDesc || this.props.disabled}>
                    <div>
                        <FormControl
                            required={this.props.required}
                            disabled={this.props.disabled}
                            onChange={(e) => this.descChanged(e)}
                            onFocus={() => this.setState({showDesc: true})}
                            onBlur={() => this.state.descChanged ? this.setState({showDesc: false}) : null}
                            as="textarea"
                            spellCheck={false}
                            style={{maxHeight: 500}}
                            name={this.props.name + "[][desc]"}
                            value={this.props.desc}
                            placeholder={(this.props.placeholder?.description !== undefined) ? this.props.placeholder?.description : "Beschreibung"}
                        />
                    </div>
                </Collapse>

                <input name={this.props.name + "[][id]"} type={"hidden"} style={{display: "none", visibility: "hidden"}}
                       value={this.props.id ? this.props.id : undefined}/>
            </div>
        );
    }

}

export type CardComponentField = {
    name: string
    desc: string
    id: string | null
};

export type CardComponentFields = CardComponentField[];

export interface CardComponentFieldPlaceholder {
    description?: string
    name?: string
}

export interface CardComponentProps {
    name: string
    values: CardComponentFields
    disabled: boolean
    min: number
    max: number
    onChanged: (values: CardComponentFields) => void
    hide?: boolean
    required?: boolean
    counter?: CounterInterface
    placeholder?: CardComponentFieldPlaceholder
}

class CardComponent extends Component<CardComponentProps, {}> {

    private cardUpdatedListener(index: number, name: string, desc: string) {
        let newValues = this.props.values.slice();
        newValues[index] = {
            id: newValues[index].id,
            name: name,
            desc: desc
        }
        this.props.onChanged(newValues);
    }

    private removeCard(index: number) {
        let newValues = this.props.values;
        if (newValues.length > this.props.min) {
            newValues.splice(index, 1);
            this.props.onChanged(newValues);
        }
    }

    private addCard() {
        let newValues = this.props.values.slice();
        if (newValues.length < this.props.max) {
            newValues.push({name: "", desc: "", id: this.props.counter?.get(this.props.values.length) ?? null})
            this.props.onChanged(newValues);
        }
    }


    getAllCards = () => {

        let required = (this.props.required !== undefined) ? this.props.required : true;

        return this.props.values.map((value, index) => {
            return (
                <Card id={value.id}
                      name={this.props.name}
                      designation={value.name}
                      desc={value.desc}
                      disabled={this.props.disabled}
                      required={required}
                      onDelete={this.removeCard.bind(this, index)}
                      onChange={this.cardUpdatedListener.bind(this, index)}/>
            );
        });


    }

    render = () => {
        return (
            <div className={this.props.hide ? "d-none" : ""}>
                {this.getAllCards()}

                {((this.props.values.length < this.props.max) && !this.props.disabled) && (
                    <BootstrapCard onClick={this.addCard.bind(this)}
                                   className={"addCard" + ((this.props.disabled) ? " disabled" : "")} body>
                        <div className={"icon"}>
                            <FontAwesomeIcon icon={faPlus}/>
                        </div>
                    </BootstrapCard>
                )}
            </div>
        );
    }

}

export {CardComponent, Card};
