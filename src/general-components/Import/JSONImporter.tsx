export class JSONImporterError extends Error {
    constructor();
    constructor(msg?: string) {
        if (msg != undefined) {
            super(msg);
        } else {
            super("Die Datei konnte nicht übersetzt werden.");
        }
    }
}

abstract class JSONImporter {

    protected abstract validate(data: object): Promise<void>;

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

}

export {
    JSONImporter
}