import {Exporter} from "./Exporter";
import {SaveResource} from "../Datastructures";
import {SingleMessageProps} from "../Messages/Messages";


class JSONExporter<D> extends Exporter<D> {

    constructor() {
        super("JSON", "json", "application/json");
    }

    public validateExport(data: SaveResource<D>): SingleMessageProps[] {
        return [];
    }

    protected async onExport(data: SaveResource<D>): Promise<BlobPart[]> {
        return [JSON.stringify(data.data, null, 4)];
    }
}

export {
    JSONExporter
}
