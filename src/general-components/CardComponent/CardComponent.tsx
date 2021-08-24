import React, {ChangeEvent, Component, ReactElement} from "react";
import {Button, Card as BootstrapCard, Collapse, FormControl, InputGroup} from "react-bootstrap";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons/";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";

import "./card-component.scss";
import {isDesktop} from "../Desktop";
import {Messages} from "../Messages/Messages";
import {CounterInterface} from "../Counter/CounterInterface";

interface CardProps {
    name: string
    id: string | null
    disabled: boolean
    onDelete: () => void
    designation?: string
    desc?: string
}

interface CardState {
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

    descChanged = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let value = e.currentTarget.value;

        this.setState({
            descChanged: value.length > 0
        });
    }

    render = () => {
        return (
            <div>
                <InputGroup>
                    <div className={"id"} aria-disabled={this.props.disabled}>
                        {this.props.id}
                    </div>
                    <FormControl
                        required={true}
                        disabled={this.props.disabled}
                        onBlur={() => this.state.descChanged ? this.setState({showDesc: false}) : null}
                        onFocus={() => this.setState({showDesc: true})}
                        name={this.props.name + "[][name]"}
                        defaultValue={this.props.designation}
                        placeholder={"Bezeichnung"}
                    />
                    {(!this.props.disabled) && (
                        <Button onClick={() => this.props.onDelete()} variant={"link"}>
                            <FontAwesomeIcon icon={faTimes}/>
                        </Button>
                    )}
                </InputGroup>
                <Collapse in={isDesktop() || this.state.showDesc || this.props.disabled}>
                    <div>
                        <FormControl
                            // required
                            disabled={this.props.disabled}
                            onChange={(e) => this.descChanged(e)}
                            onFocus={() => this.setState({showDesc: true})}
                            onBlur={() => this.state.descChanged ? this.setState({showDesc: false}) : null}
                            as="textarea"
                            style={{maxHeight: 500}}
                            name={this.props.name + "[][desc]"}
                            defaultValue={this.props.desc}
                            placeholder={"Beschreibung"}
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

interface CardComponentProps {
    name: string
    disabled: boolean
    min: number
    max: number
    counter?: CounterInterface
    values?: CardComponentField[]
}

class CardComponent extends Component<CardComponentProps, any> {
    private cards: Map<number, ReactElement<CardProps, any>> = new Map<number, ReactElement<CardProps, any>>();
    private index: number = 0;

    constructor(props: CardComponentProps | Readonly<CardComponentProps>) {
        super(props);

        if (this.props.values) {
            for (const value of this.props.values) {
                let designation = value.name;
                let desc = value.desc;

                this.addCard(designation, desc);
            }
        } else {
            for (let i = 0; i < this.props.min; i++) {
                this.addCard();
            }
        }
    }

    addCard = (designation?: string, desc?: string) => {
        if (this.cards.size < this.props.max && !this.props.disabled) {
            let index = this.index;

            this.cards.set(
                index,
                <Card id={this.props.counter?.get(this.cards.size) || null}
                      disabled={this.props.disabled}
                      onDelete={() => this.removeCard(index)}
                      key={index}
                      name={this.props.name}
                      designation={designation}
                      desc={desc}
                />
            );
            this.index++;

            this.forceUpdate();
        }
    }

    removeCard = (index: number) => {
        if (!(this.cards.size <= this.props.min)) {
            this.cards.delete(index);
            this.forceUpdate();
        } else {
            Messages.add("Sie müssen mindestens " + this.props.min + " Punkte angeben, um fortfahren zu können.", "DANGER", Messages.TIMER);
        }
    }

    getAllCards = () => {
        let cards = Array<ReactElement<CardProps, any>>();
        let i = 1;

        this.cards.forEach((value) => {
            cards.push(React.cloneElement(value, {
                disabled: this.props.disabled,
                id: this.props.counter?.get(i) || null
            }));
            i++;
        });

        return cards;
    }

    render = () => {
        return (
            <div>
                {this.getAllCards()}

                {((this.cards.size < this.props.max) && !this.props.disabled) && (
                    <BootstrapCard onClick={() => this.addCard()}
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

export default CardComponent;