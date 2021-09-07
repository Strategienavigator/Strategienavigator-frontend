import {CounterInterface} from "./CounterInterface";


export class RomanNumeralsCounter implements CounterInterface {
    private readonly romanMatrix: [(number | string)[], (number | string)[], (number | string)[], (number | string)[], (number | string)[], (number | string)[], (number | string)[], (number | string)[], (number | string)[], (number | string)[], (number | string)[], (number | string)[], (number | string)[]];

    constructor() {
        this.romanMatrix = [
            [1000, 'M'],
            [900, 'CM'],
            [500, 'D'],
            [400, 'CD'],
            [100, 'C'],
            [90, 'XC'],
            [50, 'L'],
            [40, 'XL'],
            [10, 'X'],
            [9, 'IX'],
            [5, 'V'],
            [4, 'IV'],
            [1, 'I']
        ];
    }

    get(index: number): string | null {
        if (index > 0) {
            return this.convertToRoman(index);
        }
        return null;
    }

    convertToRoman = (number: number): string => {
        if (number <= 0) {
            return "";
        }

        for (let i = 0; i < this.romanMatrix.length; i++) {
            if (number >= this.romanMatrix[i][0]) {
                return this.romanMatrix[i][1] + this.convertToRoman(number - (this.romanMatrix[i][0] as number));
            }
        }

        return "";
    }

}
