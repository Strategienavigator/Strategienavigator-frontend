


export interface CompareHeader{
    header: string,
    desc?: string
}

/**
 * Abstrakte Klasse, welche verwendet wird, um die Überschrift im CompareComponent zu beschreiben.
 *
 * Implementierende Klassen müssen nur die getHeaders Methode überschreiben
 */
abstract class CompareHeaderAdapter {

    /**
     * Gibt die Anzahl der Überschriften zurück
     */
    public getCount() {
        return this.getHeaders().length;
    }

    /**
     * Gibt ein Array zurück mit allen Überschriften, welche angezeigt werden
     */
    public abstract getHeaders():Array<CompareHeader>;

    /**
     * Gibt eine Überschrift zurück, welche an dem übergebenen index steht
     * @param index index des von getHeaders zurückgegeben Array
     */
    public getHeader(index: number): CompareHeader {
        if (index < this.getCount()) {
            return this.getHeaders()[index];
        }
        throw new RangeError();
    }

}

export {
    CompareHeaderAdapter
}
