import {Exporter} from "./Exporter";
import {SaveResource} from "../Datastructures";


class JSONExporter<D> extends Exporter<D> {

    constructor() {
        super("JSON", "json", "application/json");
    }

    protected onExport(data: SaveResource<D>): BlobPart[] {
        return [JSON.stringify(data.data, null, 4)];
    }
}

export {
    JSONExporter
}
