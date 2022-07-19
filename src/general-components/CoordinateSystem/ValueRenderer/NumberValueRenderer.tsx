import {ValueRenderer} from "./ValueRenderer";


class NumberValueRenderer extends ValueRenderer {
    private readonly decimalPoints: number = 0;

    constructor(decimalPoints: number) {
        super();
        this.decimalPoints = decimalPoints;
    }

    render(value: number): JSX.Element {
        return (
            <>
                {parseFloat(String(value)).toFixed(this.decimalPoints)}
            </>
        );
    }

}

export {
    NumberValueRenderer
}