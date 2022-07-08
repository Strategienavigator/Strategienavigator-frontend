import React, {ComponentClass, FunctionComponent, PureComponent} from "react";
import {Card as BootstrapCard} from "react-bootstrap";
import {faPlus} from "@fortawesome/free-solid-svg-icons/";
import {CounterInterface} from "../Counter/CounterInterface";
import "./card-component.scss";
import FAE from "../Icons/FAE";
import {CustomDescriptionComponentProps} from "./CustomDescriptionComponent/CustomDescriptionComponent";
import {Card} from "./Card";


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

export type CardComponentField<D = any> = {
    name: string
    desc: string
    id: string | null
    extra?: D
};

export type CardComponentFields<D = any> = CardComponentField<D>[];

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
                         key={value.id + "-" + index}
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
        if(this.props.hide){
            return null;
        }
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
