import {ValueRenderer} from "./ValueRenderer";


/**
 * Rendert die Achsenwerte als Prozentzahl
 */
class PercantageValueRenderer implements ValueRenderer {
    private readonly decimalPoints: number = 0;

    /**
     * @param {number} decimalPoints Dezimalstellen (fix)
     */
    constructor(decimalPoints: number) {
        this.decimalPoints = decimalPoints;
    }

    render(value: number): JSX.Element {
        return (
            <>
                {parseFloat(String(value)).toFixed(this.decimalPoints)}%
            </>
        );
    }

}

export {
    PercantageValueRenderer
}