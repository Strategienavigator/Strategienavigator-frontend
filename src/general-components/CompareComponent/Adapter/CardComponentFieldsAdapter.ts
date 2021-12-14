import {CompareAdapter} from "./CompareAdapter";
import {SingleComparison} from "../CompareComponent";
import {CardComponentFields} from "../../CardComponent/CardComponent";


class CardComponentFieldsAdapter extends CompareAdapter {

    private cardComponentFields: CardComponentFields;

    constructor(cardComponentFields: CardComponentFields) {
        super();
        if (cardComponentFields.length < 2) {
            throw new Error("")
        }
        this.cardComponentFields = cardComponentFields;
    }

    public getLength(): number {
        const n = this.cardComponentFields.length;
        return this.factorial(n) / (2 * this.factorial(n - 2));
    }

    public getEntry(index: number): SingleComparison {
        let secondIndex = index + 1;

        // kriterien / (Fakultät von 2 * Fakultät von (kriterien - 2)

        // TODO make formula instead of loop
        let i = 0;
        while (secondIndex > this.cardComponentFields.length - 1 - i) {
            secondIndex -= this.cardComponentFields.length - 1 - i;
            i++;
        }
        let firstIndex = i;
        secondIndex += firstIndex;

        return {
            first: this.cardComponentFields[firstIndex].name,
            second: this.cardComponentFields[secondIndex].name
        };
    }

    private factorial(num: number): number {
        if (num === 0) return 1
        else return num * this.factorial(num - 1)
    }
}

export {
    CardComponentFieldsAdapter
}