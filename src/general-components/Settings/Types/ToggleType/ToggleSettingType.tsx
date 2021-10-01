import {ChangeEvent, Component} from "react";
import {SettingsTypeProps} from "../SettingsTypeProps";


import './toggleSettingType.scss'

export interface ToggleSettingTypeProps extends SettingsTypeProps {

}

export class ToggleSettingType extends Component<ToggleSettingTypeProps, {}> {


    constructor(props: Readonly<ToggleSettingTypeProps> | ToggleSettingTypeProps);
    constructor(props: ToggleSettingTypeProps, context: any);
    constructor(props: ToggleSettingTypeProps | Readonly<ToggleSettingTypeProps>, context?: any) {
        super(props, context);

    }

    getValue(): boolean {
        return JSON.parse(this.props.value);
    }

    parseValue(checked:boolean){
        return checked.toString();
    }

    valueChangedListener = (event: ChangeEvent) => {
        event.preventDefault();

        this.props.valueChanged(this.parseValue((event.target as HTMLInputElement).checked));
    }


    render() {

        return (
            <div className="parent">
                <label className="title" htmlFor={"checkbox-" + this.props.name}>
                    <span>{this.props.name}</span><br/>
                    <span className={"text-muted"}>{this.props.description}</span>
                    <div/>


                </label>
                <div className="type">
                    <input type="checkbox" id={"checkbox-" + this.props.name} checked={this.getValue()}
                           onChange={this.valueChangedListener}/>
                </div>
            </div>

        );
    }
}
