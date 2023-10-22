import {Exporter} from "./Exporter";
import {SaveResource} from "../Datastructures";
import {SingleMessageProps} from "../Messages/Messages";
import {ResourcesType} from "../Tool/ToolSavePage/ToolSavePage";


class JSONExporter<D> extends Exporter<D> {

    public constructor() {
        super("JSON", "json", "application/json");
    }

    protected onExport = async (data: SaveResource<D>): Promise<BlobPart[]> => {
        return [JSON.stringify(data.data, null, 4)];
    }

    protected validateExport(save: SaveResource<D>, resources: ResourcesType): SingleMessageProps[] {
        return [];
    }
}

export {
    JSONExporter
}
