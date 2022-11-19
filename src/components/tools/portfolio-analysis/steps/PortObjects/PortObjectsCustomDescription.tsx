import {
    CustomDescriptionComponent
} from "../../../../../general-components/CardComponent/CustomDescriptionComponent/CustomDescriptionComponent";
import {FormControl} from "react-bootstrap";
import React, {ChangeEvent} from "react";


export interface PortObjectsCustomDescriptionValues {
    quality: string,
    quantity: string
}

class PortObjectsCustomDescription extends CustomDescriptionComponent<PortObjectsCustomDescriptionValues, any> {

    public static QUALITY_MAX_LENGTH: number = 120;
    public static QUANTITY_MAX_LENGTH: number = 120;

    public static isEmpty(values?: PortObjectsCustomDescriptionValues): boolean {
        if (values !== undefined && values.quantity !== undefined && values.quality !== undefined) {
            return values.quality.length <= 0 || values.quantity.length <= 0;
        }
        return true;
    }

    render() {
        return (
            <>
                <FormControl
                    required={true}
                    disabled={this.props.disabled}
                    as="textarea"
                    spellCheck={false}
                    style={{maxHeight: 500}}
                    value={this.props.value.quality}
                    placeholder={"Qualitative Begründung..."}
                    title={"Qualitative Begründung"}
                    onChange={this.qualityChanged}
                />

                <FormControl
                    required={true}
                    disabled={this.props.disabled}
                    as="textarea"
                    spellCheck={false}
                    style={{maxHeight: 500}}
                    value={this.props.value.quantity}
                    placeholder={"Quantitative Begründung..."}
                    title={"Quantitative Begründung"}
                    onChange={this.quantityChanged}
                />
            </>
        );
    }

    qualityChanged = (e: ChangeEvent<HTMLTextAreaElement>) => {
        this.props.onChanged({
            quality: e.target.value,
            quantity: this.props.value.quantity
        });
    }

    quantityChanged = (e: ChangeEvent<HTMLTextAreaElement>) => {
        this.props.onChanged({
            quality: this.props.value.quality,
            quantity: e.target.value
        });
    }

}

export {
    PortObjectsCustomDescription
}