import {
    CustomDescriptionComponent
} from "../../../../../../general-components/CardComponent/CustomDescriptionComponent/CustomDescriptionComponent";
import {Form, FormGroup} from "react-bootstrap";
import "./my-custom-description.scss";

export interface MyCustomDescriptionValues {
    rating: number
}

export class MyCustomDescription extends CustomDescriptionComponent<MyCustomDescriptionValues, any> {

    render() {
        return (
            <div className={"my-custom-description"}>
                <FormGroup>
                    <Form.Label>
                        Bewertung ({this.props.value.rating})
                    </Form.Label>
                    <Form.Range
                        min={0}
                        max={5}
                        disabled={this.props.disabled}
                        value={this.props.value.rating}
                        onChange={(e) => {
                            this.props.onChanged({
                                rating: parseInt(e.target.value)
                            });
                        }}
                    />
                </FormGroup>
            </div>
        );
    }

}
