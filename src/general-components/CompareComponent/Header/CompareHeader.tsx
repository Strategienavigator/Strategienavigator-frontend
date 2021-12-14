abstract class CompareHeader {

    public getCount() {
        return this.getHeaders().length;
    }

    public abstract getHeaders():Array<string>;

    public getHeader(index: number): string {
        if (index < this.getCount()) {
            return this.getHeaders()[index];
        }
        throw new RangeError();
    }

}

export {
    CompareHeader
}