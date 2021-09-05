import React, {ChangeEvent, Component, ReactElement, RefObject} from "react";
import {Button, Card as BootstrapCard, Collapse, FormControl, InputGroup} from "react-bootstrap";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons/";
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {isDesktop} from "../Desktop";
import {Messages} from "../Messages/Messages";
import {CounterInterface} from "../Counter/CounterInterface";

import "./card-component.scss";


export interface CardProps {
    name: string
    id: string | null
    disabled: boolean
    onDelete: () => void
    designation?: string
    desc?: string
    placeholder?: CardComponentFieldPlaceholder
}

export interface CardState {
    showDesc: boolean
    descChanged: boolean
}

class Card extends Component<CardProps, CardState> {
    private currentDesc: string | undefined;
    private currentName: string | undefined;

    constructor(props: CardProps | Readonly<CardProps>) {
        super(props);

        this.state = {
            showDesc: isDesktop(),
            descChanged: false
        };
    }

    isValid = () => {
        return (this.currentDesc !== undefined && this.currentName !== undefined);
    }

    getDescription = () => {
        return this.currentDesc;
    }

    getName = () => {
        return this.currentName;
    }

    nameChanged = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        this.currentName = e.currentTarget.value;
    }

    descChanged = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        let value = e.currentTarget.value;
        this.currentDesc = value;

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
                        onChange={(e) => this.nameChanged(e)}
                        onFocus={() => this.setState({showDesc: true})}
                        name={this.props.name + "[][name]"}
                        defaultValue={this.props.designation}
                        placeholder={(this.props.placeholder?.name !== undefined) ? this.props.placeholder?.name : "Bezeichnung"}
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
                            required
                            disabled={this.props.disabled}
                            onChange={(e) => this.descChanged(e)}
                            onFocus={() => this.setState({showDesc: true})}
                            onBlur={() => this.state.descChanged ? this.setState({showDesc: false}) : null}
                            as="textarea"
                            style={{maxHeight: 500}}
                            name={this.props.name + "[][desc]"}
                            defaultValue={this.props.desc}
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
    disabled: boolean
    min: number
    max: number
    counter?: CounterInterface
    values?: CardComponentFields
    placeholder?: CardComponentFieldPlaceholder
}

class CardComponent extends Component<CardComponentProps, any> {
    private cards = new Map<number, ReactElement<CardProps, any>>();
    private cardRefs = new Map<number, RefObject<Card>>();
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

    getValues = () => {
        return this.cardRefs;
    }

    componentDidUpdate(prevProps: Readonly<CardComponentProps>, prevState: Readonly<any>): any {
        if (prevProps.values === undefined && this.props.values !== undefined) {
            this.cards.clear();

            for (const value of this.props.values) {
                let designation = value.name;
                let desc = value.desc;

                this.addCard(designation, desc);
            }
        }
    }

    addCard = (designation?: string, desc?: string) => {
        if (this.cards.size < this.props.max && !this.props.disabled) {
            let index = this.index;

            let ref = React.createRef<Card>();

            this.cards.set(
                index,
                <Card id={this.props.counter?.get(this.cards.size) || null}
                      disabled={this.props.disabled}
                      onDelete={() => this.removeCard(index)}
                      key={index}
                      name={this.props.name}
                      designation={designation}
                      ref={ref}
                      desc={desc}
                />
            );
            this.cardRefs.set(index, ref);
            this.index++;

            this.forceUpdate();
        }
    }

    removeAllCards = () => {
        this.cards.clear();
        this.cardRefs.clear();
        this.forceUpdate();
    }

    removeCard = (index: number) => {
        if (!(this.cards.size <= this.props.min)) {
            this.cards.delete(index);
            this.cardRefs.delete(index);
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
                id: this.props.counter?.get(i) || null,
                placeholder: this.props.placeholder
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

export {CardComponent, Card};
