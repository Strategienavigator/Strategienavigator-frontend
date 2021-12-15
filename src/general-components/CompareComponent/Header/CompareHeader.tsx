/**
 * Abstrakte Klasse, welche verwendet wird, um die Überschrift im CompareComponent zu beschreiben.
 *
 * Implementierende Klassen müssen nur die getHeaders Methode überschreiben
 */
abstract class CompareHeader {

    /**
     * Gibt die Anzahl der Überschriften zurück
     */
    public getCount() {
        return this.getHeaders().length;
    }

    /**
     * Gibt ein Array mit allen Überschriften, welche angezeigt werden, zurück
     */
    public abstract getHeaders():Array<string>;

    /**
     * Gibt eine Überschrift zurück, welche an der übergebenen stelle steht
     * @param index index des von getHeaders zurückgegeben Array
     */
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
