export class JSONImporterError extends Error {
    constructor(msg?: string);
    constructor(msg: string) {
        if (msg != undefined) {
            super(msg);
        } else {
            super("Die Datei konnte nicht übersetzt werden.");
        }
    }
}

/**
 *
 */
abstract class JSONImporter {
    /**
     * Wird aufgerufen wenn der Import beginnen soll.
     * Wandelt den Rohstring in ein JSON-Objekt um und validiert dies.
     *
     * @param {string} rawString
     * @returns {Promise<void>}
     */
    public async onImport(rawString: string): Promise<void> {
        try {
            let jsonString = JSON.parse(rawString);
            await this.validate(jsonString);
        } catch (e: any) {
            if (e instanceof SyntaxError) {
                throw new JSONImporterError();
            } else {
                throw e;
            }
        }
    }

    /**
     * Validiert das JSON Object.
     * Wirft ein JSONImporterError falls fehler auftreten.
     *
     * @param {object} data Das JSON-Objekt
     * @returns {Promise<void>}
     * @protected
     */
    protected abstract validate(data: object): Promise<void>;

}

export {
    JSONImporter
}