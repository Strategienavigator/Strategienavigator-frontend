import React, {ChangeEvent, Component, ComponentClass, FunctionComponent, PureComponent} from "react";
import {Button, Card as BootstrapCard, Collapse, FormControl, InputGroup} from "react-bootstrap";
import {faPlus, faTimes} from "@fortawesome/free-solid-svg-icons/";
import {isDesktop} from "../Desktop";
import {CounterInterface} from "../Counter/CounterInterface";
import "./card-component.scss";
import {compareWithoutFunctions} from "../ComponentUtils";
import FAE from "../Icons/FAE";
import {CustomDescriptionComponentProps} from "./CustomDescriptionComponent/CustomDescriptionComponent";


export interface CardProps<D = never> {
    id: string | null
    /**
     * name des input feldes
     */
    name: string
    /**
     * Wert des Beschreibungsfeldes der Karte
     */
    desc: string
    /**
     * Wert des Hauptfeldes der Karte
     */
    value: string
    index: number
    disabled: boolean
    required: boolean
    onChange: (index: number, name: string, desc: string, customDescValues?: D) => void
    onDelete?: (index: number) => void
    customDescValues?: D
    customDesc?: FunctionComponent<CustomDescriptionComponentProps<D>> | ComponentClass<CustomDescriptionComponentProps<D>>
    placeholder?: CardComponentFieldPlaceholder
}


export interface CardState {
    showDesc: boolean
    descChanged: boolean
    nameTooLong: boolean
    descTooLong: boolean
}

export function isCardComponentFilled(cardComponentFields?: CardComponentFields<object>) {
    return cardComponentFields?.every((cardComponentField: CardComponentField<object>) => {
        return cardComponentField.name.length > 0 && cardComponentField.desc.length > 0;
    });
}

export function isCardComponentTooLong(cardComponentFields?: CardComponentFields<object>) {
    return !cardComponentFields?.every((cardComponentField: CardComponentField<object>) => {
        return !(cardComponentField.name.length > Card.MAX_NAME_LENGTH || cardComponentField.desc.length > Card.MAX_DESC_LENGTH);
    });
}

class Card<D = never> extends Component<CardProps<D>, CardState> {
    public static MAX_NAME_LENGTH = 120;
    public static MAX_DESC_LENGTH = 300;

    constructor(props: CardProps<D> | Readonly<CardProps<D>>) {
        super(props);

        this.state = {
            showDesc: isDesktop(),
            descChanged: false,
            nameTooLong: false,
            descTooLong: false
        };
    }

    shouldComponentUpdate(nextProps: Readonly<CardProps<D>>, nextState: Readonly<CardState>, nextContext: any): boolean {
        return !(compareWithoutFunctions(this.props, nextProps) && compareWithoutFunctions(this.state, nextState));
    }

    nameChanged = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        if(e.currentTarget.value.length > Card.MAX_NAME_LENGTH) {
            this.setState({
                nameTooLong: true
            });
        } else {
            this.setState({
                nameTooLong: false
            });
        }

        this.props.onChange(this.props.index, e.currentTarget.value, this.props.desc, this.props.customDescValues);
    }

    componentDidMount() {
        if (this.props.value.length > Card.MAX_NAME_LENGTH) {
            this.setState({
                nameTooLong: true
            });
        }
        if (this.props.desc.length > Card.MAX_DESC_LENGTH) {
            this.setState({
                descTooLong: true
            });
        }
    }

    descChanged = (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        let value = e.currentTarget.value;

        if(e.currentTarget.value.length > Card.MAX_DESC_LENGTH) {
            this.setState({
                descChanged: value.length > 0,
                descTooLong: true
            });
        } else {
            this.setState({
                descChanged: value.length > 0,
                descTooLong: false
            });
        }

        this.props.onChange(this.props.index, this.props.value, value, this.props.customDescValues);
    }

    customDescChanged = (value: D) => {
        this.props.onChange(this.props.index, this.props.value, this.props.desc, value);
    }

    onDelete = () => {
        if (this.props.onDelete !== undefined) {
            this.props.onDelete(this.props.index);
        }
    }

    render = () => {
        let customDesc;
        if (this.props.customDesc && this.props.customDescValues !== undefined) {
            customDesc = React.createElement(this.props.customDesc, {
                value: this.props.customDescValues,
                disabled: this.props.disabled,
                name: this.props.name,
                onChanged: this.customDescChanged
            });
        }

        return (
            <div>
                <InputGroup>
                    <div className={"id"} aria-disabled={this.props.disabled}>
                        {this.props.id}
                    </div>
                    <FormControl
                        required={this.props.required}
                        disabled={this.props.disabled}
                        onBlur={this.closeIfChanged}
                        onChange={this.nameChanged}
                        onFocus={this.showDescription}
                        name={this.props.name + "[" + this.props.index + "][name]"}
                        spellCheck={false}
                        value={this.props.value}
                        placeholder={(this.props.placeholder?.name !== undefined) ? this.props.placeholder?.name : "Bezeichnung"}
                    />
                    {
                        ((!this.props.disabled) && this.props.onDelete !== undefined) ? (
                            <Button className={"noButton"} onClick={this.onDelete} variant={"link"}>
                                <FAE icon={faTimes}/>
                            </Button>
                        ) : undefined
                    }
                </InputGroup>
                {/*TODO put this logic into higher component*/}
                <Collapse in={isDesktop() || this.state.showDesc || this.props.disabled}>
                    <div>
                        <FormControl
                            required={this.props.required}
                            disabled={this.props.disabled}
                            onChange={this.descChanged}
                            onFocus={() => this.setState({showDesc: true})}
                            onBlur={() => this.state.descChanged ? this.setState({showDesc: false}) : null}
                            as="textarea"
                            spellCheck={false}
                            style={{maxHeight: 500}}
                            name={this.props.name + "[" + this.props.index + "][desc]"}
                            value={this.props.desc}
                            placeholder={(this.props.placeholder?.description !== undefined) ? this.props.placeholder?.description : "Beschreibung"}/>
                        <div>
                            {customDesc}
                        </div>
                    </div>
                </Collapse>

                <div className={"feedbackContainer"}>
                    {(this.state.nameTooLong) && (
                        <div className={"feedback DANGER"}>
                            Der Name darf maximal {Card.MAX_NAME_LENGTH} Zeichen lang sein!
                        </div>
                    )}
                    {(this.state.descTooLong) && (
                        <div className={"feedback DANGER"}>
                            Die Beschreibung darf maximal {Card.MAX_DESC_LENGTH} Zeichen lang sein!
                        </div>
                    )}
                </div>

                <input name={this.props.name + "[][index]"} value={this.props.index} type={"hidden"}/>
                <input name={this.props.name + "[" + this.props.index + "][id]"} type={"hidden"}
                       value={this.props.id ? this.props.id : undefined}/>
            </div>
        );
    }

    private showDescription = () => {
        this.setState({showDesc: true})
    }

    private closeIfChanged = () => {
        if (this.state.descChanged) {
            this.setState({showDesc: false})
        }
    }

}

export type CardComponentField<D = never> = {
    name: string
    desc: string
    id: string | null
    extra?: D
};

export type CardComponentFields<D = never> = CardComponentField<D>[];

export interface CardComponentFieldPlaceholder {
    description?: string
    name?: string
}

export interface CardComponentProps<D> {
    name: string
    values: CardComponentFields<D>
    disabled: boolean
    min: number
    max: number
    onChanged: (values: CardComponentFields<D>) => void
    hide?: boolean
    required?: boolean
    counter?: CounterInterface
    placeholder?: CardComponentFieldPlaceholder
    /**
     * React component, welcher unter den normalen Eingabefeldern des CardComponents angezeigt wird
     */
    customDescription?: FunctionComponent<CustomDescriptionComponentProps<D>> | ComponentClass<CustomDescriptionComponentProps<D>>
    /**
     * sollte den standard Wert für das extra Feld im CardComponentField zurück geben
     *
     * Wenn die Methode nicht übergeben wird, dann wird der extra Wert auf undefined gesetzt.
     */
    customDescValuesFactory?: () => D
}

class CardComponent<D = never> extends PureComponent<CardComponentProps<D>, {}> {

    getAllCards = () => {
        let required = (this.props.required !== undefined) ? this.props.required : true;

        // check and add minimum
        if (this.props.values.length < this.props.min) {
            for (let i = 0; i < this.props.min - this.props.values.length; i++) {
                this.addCard();
            }
        }

        return this.props.values.map((value, index) => {
            return (
                <Card<D> id={value.id}
                         name={this.props.name}
                         value={value.name}
                         desc={value.desc}
                         disabled={this.props.disabled}
                         required={required}
                         index={index}
                         onDelete={this.removeCard.bind(this, index)}
                         onChange={this.cardUpdatedListener}
                         customDescValues={value.extra}
                         customDesc={this.props.customDescription}/>
            );
        });
    }

    render = () => {
        let cards = this.getAllCards();

        return (
            <div className={this.props.hide ? "d-none" : ""}>
                {cards}

                {((this.props.values.length < this.props.max) && !this.props.disabled) && (
                    <BootstrapCard onClick={this.addCard}
                                   className={"addCard" + ((this.props.disabled) ? " disabled" : "")} body>
                        <div className={"icon"}>
                            <FAE icon={faPlus}/>
                        </div>
                    </BootstrapCard>
                )}
            </div>
        );
    }

    private cardUpdatedListener = (index: number, name: string, desc: string, extra?: D) => {
        let newValues = this.props.values.slice();
        newValues[index] = {
            extra: extra,
            id: newValues[index].id,
            name: name,
            desc: desc
        };
        this.props.onChanged(newValues);
    };

    private removeCard(index: number) {
        let newValues = this.props.values.slice();
        if (newValues.length > Math.max(this.props.min, index)) {
            newValues.splice(index, 1);

            this.reIdFrom(newValues, index);
            this.props.onChanged(newValues);
        }
    }

    /**
     * Setzt alle ids der Karten von dem angegeben index neu
     * @param values array in dem die CardComponents geändert werden sollen
     * @param index
     * @private
     */
    private reIdFrom(values: CardComponentFields<D>, index: number = 0) {
        for (let i = index; i < values.length; i++) {
            const current = {...values[i]};
            current.id = this.props.counter?.get(i + 1)?.toString() ?? null;
            values[i] = current;
        }
    }

    private addCard = () => {
        let newValues = this.props.values.slice();
        if (newValues.length < this.props.max) {
            let extraValue = undefined;
            if (this.props.customDescValuesFactory !== undefined) {
                extraValue = this.props.customDescValuesFactory();
            }

            newValues.push({
                name: "",
                desc: "",
                id: this.props.counter?.get(this.props.values.length + 1) ?? null,
                extra: extraValue
            });
            this.props.onChanged(newValues);
        }
    }

}

export {CardComponent, Card};
