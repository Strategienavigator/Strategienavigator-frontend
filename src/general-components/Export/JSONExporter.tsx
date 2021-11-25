import {Exporter} from "./Exporter";

export class JSONExporter<D> extends Exporter<D> {

    constructor() {
        super("JSON", "json", "application/json");
    }

    protected onExport(data: D): BlobPart[] {
        return [JSON.stringify(data)];
    }
}
