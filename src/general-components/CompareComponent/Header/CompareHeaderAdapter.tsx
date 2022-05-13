export interface CompareHeader {
    header: string,
    desc?: string
}

/**
 * Abstrakte Klasse, welche verwendet wird, um die Überschrift im CompareComponent zu beschreiben.
 *
 * Implementierende Klassen müssen nur die getHeaders Methode überschreiben
 */
abstract class CompareHeaderAdapter {
    private readonly className: String = "normalHeader";

    protected constructor(className: String) {
        this.className = className;
    }

    /**
     * Gibt die Klassenbezeichnung des Headers zurück
     *
     * @returns {String} Die CSS-Klassenbezeichnung
     */
    public getClassName(): String {
        return this.className;
    }

    /**
     * Gibt die Anzahl der Überschriften zurück
     */
    public getCount() {
        return this.getHeaders().length;
    }

    /**
     * Gibt ein Array zurück mit allen Überschriften, welche angezeigt werden
     */
    public abstract getHeaders(): Array<CompareHeader>;

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

    /**
     * Gibt den Index zurück, sollte dieser mithilfe des Headers gefunden werden.
     * Bei nicht auffinden wird -1 zurückgegeben!
     *
     * @param {string} header Der gesuchte Header
     * @returns {number}
     */
    public getIndex(header: string): number {
        let i = 0;
        for (let item of this.getHeaders()) {
            if (item.header === header) {
                return i;
            }
            i++;
        }
        return -1;
    }

}

export {
    CompareHeaderAdapter
}
