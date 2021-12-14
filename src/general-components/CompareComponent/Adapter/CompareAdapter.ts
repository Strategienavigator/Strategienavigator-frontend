import {SingleComparison} from "../CompareComponent";


abstract class CompareAdapter {

    public abstract getLength():number;

    public abstract getEntry(index:number):SingleComparison;

    public toArray():Array<SingleComparison>{
        let a = new Array<SingleComparison>();
        for (let i = 0; i < this.getLength(); i++) {
            a.push(this.getEntry(i));
        }
        return a;
    }
}

export {
    CompareAdapter
}