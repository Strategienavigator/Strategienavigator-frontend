import React, {ChangeEvent, Component, ComponentClass, FunctionComponent} from "react";
import {CustomDescriptionComponentProps} from "./CustomDescriptionComponent/CustomDescriptionComponent";
import {CardComponentFieldPlaceholder} from "./CardComponent";
import {isDesktop} from "../Desktop";
import {compareWithoutFunctions} from "../ComponentUtils";
import {Button, Collapse, FormControl, InputGroup} from "react-bootstrap";
import FAE from "../Icons/FAE";
import {faTimes} from "@fortawesome/free-solid-svg-icons";


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
        if (e.currentTarget.value.length > Card.MAX_NAME_LENGTH) {
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

        if (e.currentTarget.value.length > Card.MAX_DESC_LENGTH) {
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

export {
    Card
}