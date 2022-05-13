import {CompareAdapter} from "./CompareAdapter";
import {SingleComparison} from "../CompareComponent";
import {CardComponentFields} from "../../CardComponent/CardComponent";


/**
 * Ein CompareAdapter, welcher alle CardComponentFields eine kombination zuweist, und die zweite Kombinationsvariante leer lässt
 */
class LinearCardComponentFieldsAdapter extends CompareAdapter {
    private cardComponentFields: CardComponentFields;

    constructor(cardComponentFields: CardComponentFields) {
        super();
        this.cardComponentFields = cardComponentFields;
    }

    /**
     * Gibt eine SingleComparison zurück, welche als ersten Eintrag den Namen des CardComponentFields an dem Index hat und den zweiten Eintrag leer lässt.
     * @param index
     */
    getEntry(index: number): SingleComparison {
        return {first: this.cardComponentFields[index].name};
    }

    getLength(): number {
        return this.cardComponentFields.length;
    }

}

export {
    LinearCardComponentFieldsAdapter
}
