import {SingleComparison} from "../CompareComponent";

/**
 * Abstrakte Klasse für das CompareComponent welche Methoden der Adapter Klasse zu definieren, welche genutzt werden, um alle Kombinationen anzuzeigen
 */
abstract class CompareAdapter {
    /**
     * Gibt die Länge zurück die dieser Adapter unterstützt
     *
     */
    public abstract getLength():number;

    /**
     * Gibt den Eintrag für den übergebenen Index zurück
     *
     * Der Index muss folgenden Zahlenbereich unterstützen: 0 <= index < this.getLength()
     * @param index der index, liegt im Zahlenbereich 0 <= index < this.getLength()
     */
    public abstract getEntry(index:number):SingleComparison;

    /**
     * Erstellt ein neues Array mit allen Werten, welche die getEntry Methode zurückgibt.
     *
     * Die länge des Arrays entspricht immer dem Wert der von this.getLength() zurückgegeben wird.
     */
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
